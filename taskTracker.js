const fs = require('fs'); // `fs` module ko import kar rahe hain jo file system ke saath kaam karta hai.
const path = require('path'); // `path` module ko import kar rahe hain jo file ya directory path ko handle karta hai.

const filePath = path.join(__dirname, 'tasks.json'); // `tasks.json` file ka path create kar rahe hain using the current directory.

if (!fs.existsSync(filePath)) { // Check kar rahe hain agar `tasks.json` file exist nahi karti.
    fs.writeFileSync(filePath, JSON.stringify([])); // Agar file exist nahi karti toh ek empty array ke saath file create kar rahe hain.
}

const [action, ...args] = process.argv.slice(2); // Command line arguments ko extract kar rahe hain. Pehla argument `action` hoga aur baaki `args` array mein store honge.

function saveTasks(tasks) { // Yeh function tasks array ko `tasks.json` file mein save karta hai.
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2)); // `tasks.json` file ko overwrite karke tasks ko JSON format mein save karte hain.
}

function loadTasks() { // Yeh function `tasks.json` file se tasks ko load karta hai.
    try {
        const data = fs.readFileSync(filePath, 'utf-8'); // `tasks.json` file ka content read kar rahe hain.
        if (data.trim() === "") { // Agar file ka content empty hai toh return karte hain ek empty array.
            return [];
        }
        return JSON.parse(data); // JSON format mein jo data hai usko parse karke return kar rahe hain.
    } catch (error) { // Agar koi error hota hai file read karte waqt toh usko catch karte hain.
        console.log("Error reading tasks from file:", error.message); // Error message ko console mein print karte hain.
        return []; // Return karte hain ek empty array agar error hota hai.
    }
}

switch (action) { // `action` ke basis par switch-case statement ka use kar rahe hain.
    case 'add': // Agar `action` add hai toh:
        const description = args.join(' '); // `args` array se task ka description generate kar rahe hain.
        if (!description) { // Agar description empty hai toh error message show karte hain.
            console.log('Please provide a description for the task.');
            break;
        }
        const tasks = loadTasks(); // Pehle se existing tasks ko load kar rahe hain.
        const newTask = { // Naya task object create kar rahe hain.
            id: tasks.length + 1, // Task ka id tasks array ki length se generate kar rahe hain.
            description, // Task ka description jo user ne diya.
            status: 'todo', // Task ka initial status `todo` set kar rahe hain.
            createdAt: new Date().toISOString(), // Task ka creation time set kar rahe hain.
            updatedAt: new Date().toISOString() // Task ka last updated time set kar rahe hain.
        };
        tasks.push(newTask); // Naye task ko tasks array mein add kar rahe hain.
        saveTasks(tasks); // Updated tasks ko file mein save kar rahe hain.
        console.log('Task added:', newTask); // Confirmation message print karte hain.
        break;

    case 'list': // Agar `action` list hai toh:
        const tasksList = loadTasks(); // Pehle se existing tasks ko load kar rahe hain.
        if (tasksList.length === 0) { // Agar koi task nahi hai toh message show karte hain.
            console.log('No tasks found.');
        } else {
            console.table(tasksList); // Tasks ko tabular format mein print karte hain.
        }
        break;

    case 'update': // Agar `action` update hai toh:
        const taskIdToUpdate = parseInt(args[0], 10); // Task ID jo update karna hai, wo extract kar rahe hain.
        const newDescription = args.slice(1).join(' '); // Naya description jo user ne diya, usko extract kar rahe hain.
        if (!taskIdToUpdate || !newDescription) { // Agar ID ya description valid nahi hai toh error show karte hain.
            console.log('Please provide a valid task ID and new description.');
            break;
        }
        const tasksToUpdate = loadTasks(); // Pehle se existing tasks ko load kar rahe hain.
        const taskToUpdate = tasksToUpdate.find(t => t.id === taskIdToUpdate); // Update karne wala task find kar rahe hain.
        if (!taskToUpdate) { // Agar task nahi milta toh error show karte hain.
            console.log('Task not found.');
            break;
        }
        taskToUpdate.description = newDescription; // Task ka description update kar rahe hain.
        taskToUpdate.updatedAt = new Date().toISOString(); // Task ka updated time bhi set kar rahe hain.
        saveTasks(tasksToUpdate); // Updated tasks ko file mein save kar rahe hain.
        console.log('Task updated:', taskToUpdate); // Confirmation message print karte hain.
        break;

    case 'delete': // Agar `action` delete hai toh:
        const taskIdToDelete = parseInt(args[0], 10); // Task ID jo delete karna hai, wo extract kar rahe hain.
        if (!taskIdToDelete) { // Agar ID valid nahi hai toh error show karte hain.
            console.log('Please provide a valid task ID.');
            break;
        }
        let tasksToDelete = loadTasks(); // Pehle se existing tasks ko load kar rahe hain.
        tasksToDelete = tasksToDelete.filter(t => t.id !== taskIdToDelete); // Specified ID wala task ko filter out kar rahe hain.
        saveTasks(tasksToDelete); // Updated tasks ko file mein save kar rahe hain.
        console.log('Task deleted.'); // Confirmation message print karte hain.
        break;

    case 'in-progress': // Agar `action` in-progress hai toh:
        const taskIdInProgress = parseInt(args[0], 10); // Task ID jo in-progress mark karna hai, wo extract kar rahe hain.
        if (!taskIdInProgress) { // Agar ID valid nahi hai toh error show karte hain.
            console.log('Please provide a valid task ID.');
            break;
        }
        const tasksInProgress = loadTasks(); // Pehle se existing tasks ko load kar rahe hain.
        const taskInProgress = tasksInProgress.find(t => t.id === taskIdInProgress); // Specified ID wala task find kar rahe hain.
        if (!taskInProgress) { // Agar task nahi milta toh error show karte hain.
            console.log('Task not found.');
            break;
        }
        taskInProgress.status = 'in-progress'; // Task ka status `in-progress` set kar rahe hain.
        taskInProgress.updatedAt = new Date().toISOString(); // Task ka updated time bhi set kar rahe hain.
        saveTasks(tasksInProgress); // Updated tasks ko file mein save kar rahe hain.
        console.log('Task marked as in progress:', taskInProgress); // Confirmation message print karte hain.
        break;

    case 'done': // Agar `action` done hai toh:
        const taskIdDone = parseInt(args[0], 10); // Task ID jo done mark karna hai, wo extract kar rahe hain.
        if (!taskIdDone) { // Agar ID valid nahi hai toh error show karte hain.
            console.log('Please provide a valid task ID.');
            break;
        }
        const tasksDone = loadTasks(); // Pehle se existing tasks ko load kar rahe hain.
        const taskDone = tasksDone.find(t => t.id === taskIdDone); // Specified ID wala task find kar rahe hain.
        if (!taskDone) { // Agar task nahi milta toh error show karte hain.
            console.log('Task not found.');
            break;
        }
        taskDone.status = 'done'; // Task ka status `done` set kar rahe hain.
        taskDone.updatedAt = new Date().toISOString(); // Task ka updated time bhi set kar rahe hain.
        saveTasks(tasksDone); // Updated tasks ko file mein save kar rahe hain.
        console.log('Task marked as done:', taskDone); // Confirmation message print karte hain.
        break;

    case 'list-done': // Agar `action` list-done hai toh:
        const doneTasks = loadTasks().filter(t => t.status === 'done'); // Sare done status wale tasks ko filter kar rahe hain.
        if (doneTasks.length === 0) { // Agar koi done task nahi milta toh message show karte hain.
            console.log('No tasks marked as done.');
        } else {
            console.table(doneTasks); // Done tasks ko tabular format mein print karte hain.
        }
        break;

    case 'list-todo': // Agar `action` list-todo hai toh:
        const todoTasks = loadTasks().filter(t => t.status === 'todo'); // Sare todo status wale tasks ko filter kar rahe hain.
        if (todoTasks.length === 0) { // Agar koi todo task nahi milta toh message show karte hain.
            console.log('No tasks marked as todo.');
        } else {
            console.table(todoTasks); // Todo tasks ko tabular format mein print karte hain.
        }
        break;

    case 'list-in-progress': // Agar `action` list-in-progress hai toh:
        const inProgressTasks = loadTasks().filter(t => t.status === 'in-progress'); // Sare in-progress status wale tasks ko filter kar rahe hain.
        if (inProgressTasks.length === 0) { // Agar koi in-progress task nahi milta toh message show karte hain.
            console.log('No tasks in progress.');
        } else {
            console.table(inProgressTasks); // In-progress tasks ko tabular format mein print karte hain.
        }
        break;

    default: // Agar koi unknown action hota hai toh:
        console.log('Unknown action. Please use one of the following actions: add, list, update, delete, in-progress, done, list-done, list-todo, list-in-progress.'); // User ko available actions ke list ke saath error message show karte hain.
}
