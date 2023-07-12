import { BaseClass } from '../components/base-component.js';
import * as Validation from '../utils/validation.js'; // a way to avoid the name clashes of the functions of different imported libs
import { autobind as Autobind } from '../decorators/autobind.js'; //a away to alias for a single export
import { projectState } from '../state/project-state.js';

// Project Class
export class ProjectInput extends BaseClass<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input');
        this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement;

        this.configure();
    }

    configure() {
        this.element.addEventListener('submit', this.submitHandler);
        //this.element.addEventListener('submit', this.submitHandler.bind(this)); //default way to bind event handler
    }

    renderContent(){}

    private gatherUserInput():[string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidatable: Validation.Validatable = {
            value: enteredTitle,
            required: true
        }

        const descriptionValidatable: Validation.Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }

        const peopleValidatable: Validation.Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        }

        if(
            !Validation.validate(titleValidatable) || 
            !Validation.validate(descriptionValidatable) || 
            !Validation.validate(peopleValidatable))
        {
            alert("Invalid Input, Please try again!!");
            return;
        }else{
            return [enteredTitle, enteredDescription, +enteredPeople]; //adding plus before, to make it a number
        }
    }

    private clearInputs(){
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    @Autobind //Decorator
    private submitHandler(event: Event){
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if(Array.isArray(userInput)){
            const [title, description, people] = userInput;
            projectState.addProject(title, description, people);
            this.clearInputs();
        }
        //console.log(this.titleInputElement.value);
    } 
}