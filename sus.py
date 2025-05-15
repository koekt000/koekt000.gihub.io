import sqlite3

# Подключение к базам данных
conn3 = sqlite3.connect('tasks3.db')
conn4 = sqlite3.connect('tasks4.db')

# Создание курсоров
cursor3 = conn3.cursor()
cursor4 = conn4.cursor()

# Извлечение всех данных из tasks3.db
cursor3.execute("SELECT * FROM task3")
tasks = cursor3.fetchall()
print("sus")
# Вставка данных в tasks4.db
for task in tasks:
    try:
        cursor4.execute("INSERT INTO task4 (id, number, task, answer, explain) VALUES (?, ?, ?, ?, ?)", task)
        conn4.commit()
    except:
        None

# Сохранение изменений и закрытие соединений
conn4.commit()
conn3.close()
conn4.close()
