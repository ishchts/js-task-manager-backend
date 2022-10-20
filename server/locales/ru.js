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
          success: 'Пользователь успешно удалён',
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
          success: 'Статус успешно изменён',
        },
        delete: {
          error: 'Не удалось удалить статус',
          success: 'Статус успешно удалён',
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
      labels: {
        create: {
          error: 'Не удалось создать метку',
          success: 'Метка успешно создана',
        },
        edit: {
          error: 'Не удалось обновить метку',
          success: 'Метка успешно изменена',
        },
        delete: {
          error: 'Не удалось удалить метку',
          success: 'Метка успешно удалена',
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
        labels: 'Метки',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      user: {
        id: 'ID',
        firstName: 'Имя',
        lastName: 'Фамилия',
        fullName: 'Полное имя',
        email: 'Email',
        password: 'Пароль',
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
        editBtn: 'Изменить',
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
      task: {
        filter: {
          onlyMyTasks: 'Только мои задачи',
        },
      },
      tasks: {
        title: 'Задачи',
        createBtn: 'Создать задачу',
        id: 'ID',
        name: 'Наименование',
        status: 'Статус',
        statusId: 'Статус',
        creator: 'Автор',
        executor: 'Исполнитель',
        executorId: 'Исполнитель',
        createdAt: 'Дата создания',
        actions: '',
        editBtn: 'Изменить',
        deleteBtn: 'Удалить',
        description: 'Описание',
        labels: 'Метки',
        label: 'Метка',
        create: {
          title: 'Создание задачи',
        },
        new: {
          submit: 'Создать',
          show: 'Показать',
        },
        edit: {
          title: 'Изменение задачи',
          submit: 'Изменить',
        },
      },
      label: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        title: 'Метки',
        btn: {
          create: 'Создать метку',
          edit: 'Изменить',
          delete: 'Удалить',
        },
        new: {
          title: 'Создание метки',
          submit: 'Создать',
        },
        edit: {
          title: 'Редатирование метки',
          submit: 'Изменить',
        },
      },
      taskStatus: {
        name: 'Наименование',
      },
    },
  },
};
