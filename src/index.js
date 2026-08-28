import { DisplayController } from './displayController.js';
import { TodoApp } from './appLogic.js';
import './styles.css';

const appLogic = new TodoApp();
const displayController = new DisplayController(appLogic);
displayController.init();