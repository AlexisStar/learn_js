/* Задание на урок:

1) Создать переменную numberOfFilms и в неё поместить ответ от пользователя на вопрос:
'Сколько фильмов вы уже посмотрели?'

2) Создать объект personalMovieDB и в него поместить такие свойства:
    - count - сюда передается ответ на первый вопрос
    - movies - в это свойство поместить пустой объект
    - actors - тоже поместить пустой объект
    - genres - сюда поместить пустой массив
    - privat - в это свойство поместить boolean(логическое) значение false

3) Задайте пользователю по два раза вопросы:
    - 'Один из последних просмотренных фильмов?'
    - 'На сколько оцените его?'
Ответы стоит поместить в отдельные переменные
Записать ответы в объект movies в формате:
    movies: {
        'logan': '8.1'
    }

Проверить, чтобы все работало без ошибок в консоли */

'use strict';

process.stdin.setEncoding('utf8');
process.stdout.setEncoding('utf8')

const personalMovieDB = {
    count: 0,
    movies: {},
    actors: {},
    genres: {},
    privat: false,
};

const questions = {
    1: {
        text: 'Сколько фильмов вы уже посмотрели?',
        validate: (input) => !isNaN(parseInt(input)),
        validateError: 'Введите число',
        handler: (input) => {
            personalMovieDB.count = parseInt(input)
            setState(++STATE)
        },
        error: (error) => {
            process.stdout.write(error)
            setState(STATE)
        }
    },
    2: {
        text: 'Один из последних просмотренных фильмов?',
        handler: (input) => {
            personalMovieDB.movies = {[input]: 0,}
            setState(++STATE, input)
        },
        error: (error) => {
            process.stdout.write(error)
            setState(STATE)
        }
    },
    3: {
        text: 'На сколько оцените его?',
        validate: (input) => !isNaN(parseFloat(input)),
        validateError: 'Введите число',
        handler: (input) => {
            personalMovieDB.movies = {[STATE_CONTEXT]: parseFloat(input)}
            setState(++STATE, null)
        },
        error: (error) => {
            process.stdout.write(error)
            setState(STATE)
        }
    }
}

let STATE = 0
let STATE_CONTEXT = null;

const setState = (questionIndex, context = null) => {
    STATE = questionIndex

    if (context !== null)
        STATE_CONTEXT = context

    if(!questions[questionIndex])
        process.exit()

    startQuestion(
        questions[questionIndex].text,
        questions[questionIndex].validate,
        questions[questionIndex].validateError
    )
        .then(input => questions[questionIndex].handler(input))
        .catch(error => questions[questionIndex].error(error))
}


const startQuestion = (question, validate = null, validateError = null) => {
    return new Promise((resolve, reject) => {
        process.stdout.write(question + '\n')

        const listener = () => {
            const input = process.stdin.read();

            if (input === null)
                return

            if (validate) {
                if(validate(input)) {
                    process.stdin.removeListener("readable", listener)
                    resolve(input)
                } else {
                    process.stdin.removeListener("readable", listener)
                    reject(validateError ? validateError + '\n' : 'Что то пошло не так')
                }
            } else {
                process.stdin.removeListener("readable", listener)
                resolve(input)
            }
        }

        process.stdin.on('readable', listener)
    })

}


function main() {
    process.on('exit', () => {
        console.log('Спасибо, досвидули)');
        console.dir(personalMovieDB)
    });

    setState(++STATE, null)
}
main()