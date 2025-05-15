import requests
import re
import random as r
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String
def parse(id):
    link1 = 'https://rus-ege.sdamgia.ru/test?a=show_result&stat_id='
    link2 = '&retriable=1'
    response = requests.get(link1+id+link2) 
    html = response.text
    # print(html)
    engine = create_engine("sqlite:///tasks3.db")
    Session = sessionmaker(bind=engine)
    Base = declarative_base()
    html = html.replace('­', '')
    class Task(Base):
        __tablename__ = "task3"
        id = Column(Integer, primary_key=True, autoincrement=True)
        number =  Column(Integer)
        task = Column(String)
        answer = Column(String)
        explain = Column(String)
    Base.metadata.create_all(engine)

    patern_blocks = r'<div style="margin-bottom:25px" class="(?:right|not_right)">.*?(?=<div style="margin-bottom:25px" class="(?:right|not_right)">|<!--np-->|\Z)'
    blocks = re.findall(patern_blocks, html, re.DOTALL)
    patern_tasks = r'<div align="justify" width="100%" class="pbody">(.*?)(?=Пояснение)'
    patern_numbers = r'(?<=тип ).*?(?=<)'
    patern_answers_1 = r'(?<=Правильный ответ:).*?(?=<)'
    patern_answers_2 = r'(?<=<p><span style="letter-spacing: 2px;">Ответ:).*?(?=<)'
    explain_patern = r'(?<=Пояснение).*?(?=Ваш ответ)'
    session = Session()
    while '' in blocks:
        blocks.remove('')
    for i in blocks:
        tasks = re.findall(patern_tasks, i, re.DOTALL)
        #tasks[0] = re.sub(r'<[^>]+>', '\n', tasks[0])
        #tasks[0]= re.sub(r'&[^;]*;', '', tasks[0])
        numbers = re.findall(patern_numbers, i)
        try:
            costyl993 = re.findall(patern_answers_2, i)[-1].replace(" или ", "|")
        except:
            print("e")
        answers = costyl993.split("ИЛИ")
        if not(answers):
            try:
                costyl993 = re.findall(patern_answers_1, i)[-1].replace(" или ", "ИЛИ").replace(";", "ИЛИ")
                answers = costyl993.split("|")
            except:
                print("e")
        
        answers.sort()
        explain = re.findall(explain_patern, i, re.DOTALL)
        #explain[0] = re.sub(r'<[^>]+>', '', explain[0])
        for j in range(len(answers)):
            answers[j] = answers[j].split(" ")
        answers[-1] = "|".join(''.join(l) for l in answers)
        answers[-1] = answers[-1].replace("</span>", '')
        answers[-1] = answers[-1].replace(".", '')
        answers[-1] = answers[-1].replace("ИЛИ", '|')
        answers[-1] = answers[-1].replace(",", '')
        answers[-1] = answers[-1].lower()
        # print(tasks, answers, numbers, explain)
        print(answers)
        new_task = Task(task=tasks[0], answer=answers[-1], number = int(numbers[0]), explain = explain[0])
        session.add(new_task)

        session.commit()
        session.close()



# for iii in range(9809718, 1054023, -1):
for iii in range(9747904, 1000000, -1):
    # parse('8'+str(iii))
    print('https://rus-ege.sdamgia.ru/test?a=show_result&stat_id='+"8"+str(iii)+'&retriable=1')
    try:
        parse('8'+str(iii))
    except Exception as e: 
        print(e)