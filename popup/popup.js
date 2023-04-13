const startBtn = document.querySelector('#start-timer-btn')
const resetBtn = document.querySelector('#reset-timer-btn')
const addTaskBtn = document.querySelector('#add-task-btn')
const taskInput = document.querySelector('#task-input')
const taskContainer = document.querySelector('#tasks')

let tasks = []

chrome.storage.sync.get(['tasks'], (res) => {
  tasks = res.tasks ? res.tasks : []
  renderTasks()
})

const saveTasks = () => {
  chrome.storage.sync.set({
    tasks,
  })
}

const updateTime = () => {
  chrome.storage.local.get(['timer', 'timeOption'], (res) => {
    const time = document.querySelector('#time')
    const minutes = res.timeOption - Math.ceil(res.timer / 60)
    const seconds = 60 - (res.timer % 60)
    time.textContent = `${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds === 60 ? `00` : seconds < 10 ? `0${seconds}` : seconds
    }`
  })
}
updateTime()
setInterval(updateTime, 1000)

startBtn.addEventListener('click', () => {
  chrome.storage.local.get(['isRunning'], (res) => {
    chrome.storage.local.set(
      {
        isRunning: !res.isRunning,
      },
      () => {
        startBtn.textContent = !res.isRunning ? 'Pause Timer' : 'Start Timer'
      }
    )
  })
})

resetBtn.addEventListener('click', () => {
  chrome.storage.local.set(
    {
      timer: 0,
      isRunning: false,
    },
    () => {
      startBtn.textContent = 'Start Timer'
    }
  )
})

const renderTask = (taskNum) => {
  const taskRow = document.createElement('div')
  const input = document.createElement('input')
  input.type = 'text'
  input.placeholder = 'Enter a task...'
  input.value = tasks[taskNum]
  input.classList = 'task-input'
  input.addEventListener('change', () => {
    tasks[taskNum] = input.value
    saveTasks()
  })

  const deleteBtn = document.createElement('input')
  deleteBtn.type = 'button'
  deleteBtn.value = 'x'
  deleteBtn.classList = 'delete-btn'
  deleteBtn.addEventListener('click', () => {
    deleteTask(taskNum)
  })

  taskRow.append(input, deleteBtn)
  taskContainer.append(taskRow)
}

addTaskBtn.addEventListener('click', () => addTask())
const addTask = () => {
  const taskN = tasks.length
  tasks.push('')
  renderTask(taskN)
  saveTasks()
}

const deleteTask = (taskNum) => {
  tasks.splice(taskNum, 1)
  renderTasks()
  saveTasks()
}

const renderTasks = () => {
  taskContainer.textContent = ''
  tasks.forEach((taskText, i) => {
    renderTask(i)
  })
}
