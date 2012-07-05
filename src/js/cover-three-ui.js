c3.ui = (function ($, app, board, game) {
  "use strict";
  function setBoardSquare(index, pieceSize, playerId) {
    board.setSquarePiece(
        index,
        app.piece(pieceSize, playerId),
        game);
  }

  function paintSquare(squareId, oldPiece, newPiece) {
    var square = document.getElementById("s" + squareId),
        content;

    if (app.isNone(newPiece.size)) {
      content = "&nbsp;";
    } else {
      content = '<img src="images/piece' + newPiece.size + '_player' + newPiece.playerId + '.svg" />';
    }
    $.setInnerHTML(square, content);
  }

  function disableSquare(squareId) {
    var query = $.query("s" + squareId);
    var square = document.getElementById("s" + squareId);
    if ($.hasClass(square, "sqr")) {
      query.removeEventListener("click")
        .removeClass("sqr")
        .addClass("sqr-off");
    }
  }

  function disableBoard() {
    $.query("*").setStyle("cursor", "default");
    $.query(".sqr").removeEventListener("click")
        .removeClass("sqr")
        .addClass("sqr-off");
  }

  function getMessageContainer() {
    return document.getElementById("message");
  }

  function setMessage(msg) {
    $.setInnerHTML(getMessageContainer(), msg);
  }

  function changePlayerTurn(playerId) {
    var messageContainer, oldClass;
    messageContainer = getMessageContainer();
    oldClass = "player-" + (app.equals(playerId, app.player1) ? app.player2 : app.player1);

    $.removeClass(messageContainer, oldClass);
    $.addClass(messageContainer, "player-" + playerId);

    setMessage("Player " + (playerId + 1) + "'s turn.");
  }

  function clickSquare(squareId) {
    var oldPiece,
        newPiece,
        updatedGame;
    oldPiece = board.getSquarePiece(squareId);

    if (oldPiece.size === app.smallPiece &&
        oldPiece.playerId === game.get().playerId) {
      return;
    }

    newPiece = app.piece(
        oldPiece.getNextSize(),
        game.get().playerId
    );

    setBoardSquare(squareId, newPiece.size, newPiece.playerId);
    paintSquare(squareId, oldPiece, newPiece);
    if (newPiece.size === app.largePiece) {
      disableSquare(squareId);
    }

    updatedGame = game.get();

    if (updatedGame.over) {
      disableBoard();
      setMessage("PLAYER " +
          (updatedGame.winningPlayerId + 1) +
          " WINS!");
    } else {
      changePlayerTurn(updatedGame.playerId);
    }
  }

  function repaint(currentGame) {
    var squares = currentGame.squares,
      empty = c3.piece(app.none, app.none),
      square,
      i;
    for (i = 0; i < 9; i += 1) {
      square = squares[i];
      paintSquare(i, empty, c3.piece(square.size, square.playerId));
    }
    changePlayerTurn(currentGame.playerId);
  }

  function setup() {
    $.query(".sqr").listen("click",
      function (e) {
        clickSquare(app.toInt(e.currentTarget.id.charAt(1)));
        WinJS.Application.sessionState.game = c3.game.get();
      }, true);
  }

  return {
    run: setup,
    setMessage: setMessage,
    repaint: repaint
  };
}(WinJS.Utilities, c3, c3.board, c3.game));
