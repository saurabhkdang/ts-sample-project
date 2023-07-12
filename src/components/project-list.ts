import { BaseClass } from "./base-component";
import { DragTarget } from "../models/drag-drop";
import { Project } from "../models/project";
import { autobind } from "../decorators/autobind";
import { projectState } from "../state/project-state";
import { ProjectStatus } from "../models/project";
import { ProjectItem } from "./project-item";

// Project List Class
export class ProjectList extends BaseClass<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished') {

        super('project-list', 'app', false, `${type}-projects`);
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    
    @autobind
    dragOverHandler(event: DragEvent): void {

        if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
            event.preventDefault(); //to allow drag, as it disable by default in JS
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');
        }

    }

    @autobind
    dropHandler(event: DragEvent): void {
        const prjId = event.dataTransfer!.getData('text/plain');
        projectState.moveProject(prjId,
            this.type == 'active'? ProjectStatus.Active : ProjectStatus.Finished)
    }

    @autobind
    dragLeaveHandler(event: DragEvent): void {
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');
    }

    configure(){

        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);

        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(prj => {
                if(this.type === 'active')
                return prj.status === ProjectStatus.Active;

                return prj.status === ProjectStatus.Finished;
            })
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        })
    }

    renderContent(){
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    renderProjects(){
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = '';
        for (const prjItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
        }
    }

    
}