export default {
  translation: {
    appName: 'Fastify Шаблон',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        edit: {
          error: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
          editError: 'Не удалось изменить пользователя',
          permissionError: 'Вы не можете редактировать или удалять другого пользователя',
          success: 'Пользователь успешно изменён',
        },
        delete: {
          success: 'Пользователь успешно удален',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
      taskStatus: {
        create: {
          error: 'Не удалось создать статус',
          success: 'Статус успешно создан',
        },
        edit: {
          error: 'Не удалось обновить статус',
          success: 'Статус успешно обновлен',
        },
        delete: {
          error: 'Не удалось удалить статус',
          success: 'Статус успешно удален',
        },
      },
      tasks: {
        create: {
          sucess: 'Задача успешно создана',
          error: 'Не удалось создать задачу',
        },
        edit: {
          success: 'Задача успешно изменена',
          error: 'Не удалось изменить задачу',
        },
        delete: {
          success: 'Задача успешно удалена',
          error: 'Не удалось удалить задачу',
          permission: 'Задачу может удалить только её автор',
        },
      },
    },
    layouts: {
      application: {
        users: 'Пользователи',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        statuses: 'Статусы',
        tasks: 'Задачи',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        id: 'ID',
        fullName: 'Полное имя',
        email: 'Email',
        createdAt: 'Дата создания',
        actions: 'Действия',
        editBtn: 'Изменить',
        deleteBtn: 'Удалить',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        edit: {
          title: 'Изменение пользователя',
        },
      },
      welcome: {
        index: {
          hello: 'Привет от Хекслета!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
      statuses: {
        title: 'Статусы',
        createBtn: 'Создать статус',
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        create: {
          title: 'Создание статуса',
        },
        new: {
          submit: 'Создать',
        },
      },
      tasks: {
        title: 'Задачи',
        createBtn: 'Создать задачу',
        id: 'ID',
        name: 'Наименование',
        statusId: 'Статус',
        creatorId: 'Автор',
        executorId: 'Исполнитель',
        createdAt: 'Дата создания',
        actions: '',
        editBtn: 'Изменить',
        deleteBtn: 'Удалить',
        create: {
          title: 'Создание задачи',
        },
        new: {
          submit: 'Создать',
        },
        edit: {
          title: 'Изменение задачи',
          submit: 'Изменить',
        },
      },
    },
  },
};
