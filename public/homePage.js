"use strict";

const logoutButton = new LogoutButton();
logoutButton.action = () => {
  ApiConnector.logout(response => {
    if (response.success) {
      location.reload();
    }
  })
}

ApiConnector.current(response => {
  if (response.success) {
    ProfileWidget.showProfile(response.data)
  }
})

const board = new RatesBoard();
function course() {
  ApiConnector.getStocks(response => {
    if (response.success) {
      board.clearTable();
      board.fillTable(response.data);
    }
  })
}
course();
setInterval(course, 60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, "Пополнение произведено успешно");
    } else {
      moneyManager.setMessage(response.success, "Ошибка пополнения! " + response.error);
    }
  })
}

moneyManager.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage (response.success, "Валюта конвертирована успешно")
    } else {
      moneyManager.setMessage(response.success, "Ошибка конвертации! " + response.error);
    }
  })
}

moneyManager.sendMoneyCallback = (data) => {
  ApiConnector.transferMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage (response.success, "Валюта успешно переведена")
    } else {
      moneyManager.setMessage(response.success, "Ошибка перевода! " + response.error);
    }
  })
}


const favorites = new FavoritesWidget();
ApiConnector.getFavorites(response => {
  if (response.success) {
    favorites.clearTable();
    favorites.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
})

favorites.addUserCallback = (data) => {
  ApiConnector.addUserToFavorites(data, response => {
    if (response.success) {
      favorites.clearTable();
      favorites.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favorites.setMessage(response.success, "Пользователь добавлен в избранное");
    } else {
      favorites.setMessage(response.success, "Ошбика добавления пользователя" + response.error);
    }
  })
}

favorites.removeUserCallback = (data) => {
  ApiConnector.removeUserFromFavorites(data, response => {
    if (response.success) {
      favorites.clearTable();
      favorites.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favorites.setMessage(response.success, "Пользователь удален из избранного");
    } else {
      favorites.setMessage(response.success, "Ошбика удаления пользователя" + response.error);
    }
  })
}