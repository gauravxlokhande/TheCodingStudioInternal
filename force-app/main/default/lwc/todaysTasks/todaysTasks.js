import { LightningElement, track } from 'lwc';
import CreateTask from '@salesforce/apex/tcsEmployee.CreateTask';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ReturnAllTasks from '@salesforce/apex/tcsEmployee.ReturnAllTasks';
import CreateFinalTask from '@salesforce/apex/tcsEmployee.CreateFinalTask';
import FetchAllProjects from '@salesforce/apex/tcsEmployee.FetchAllProjects';
import CreateProject from '@salesforce/apex/tcsEmployee.CreateProject';
import CurrentUserAccountDetails from '@salesforce/apex/tcsEmployee.CurrentUserAccountDetails';

export default class TodaysTasks extends LightningElement {

    @track CreateTaskTemplate = false;
    @track ProjectName = '';
    @track taskname = '';
    @track startdate;
    @track taskOptions = [];
    @track Hours = '';
    @track tasksId = '';
    @track additionalmessage = '';
    @track ShowProjectcombobox = true;
    @track valueproject;
    @track ProjectTemplate = false;
    @track StoreAllProjectsData = [];
    @track projectvalue = '';
    @track ProjectOption = [];



    @track ProjectManagerTemplate = false;
    @track EmployeeTemplate = false;



    connectedCallback() {
        this.fetchalltasks();
        this.fetchallprojects();
        this.fetchcurrentuserAccount();
    }



    fetchcurrentuserAccount() {
        CurrentUserAccountDetails()
            .then((result) => {
           //     console.log(result.Designation__c);
                if (result.Designation__c==='Project Manager') {
                    this.ProjectManagerTemplate = true;
                } else {
                    this.EmployeeTemplate = true;
                }
            }).catch((err) => {

            });
    }





    get HoursOptions() {
        return [
            { label: '00:30', value: '00:30' },
            { label: '01:00', value: '01:00' },
            { label: '01:30', value: '01:30' },
            { label: '02:00', value: '02:00' },
            { label: '02:30', value: '02:30' },
            { label: '03:00', value: '03:00' },
            { label: '03:30', value: '03:30' },
            { label: '04:00', value: '04:00' },
            { label: '04:30', value: '04:30' },
            { label: '05:00', value: '05:00' },
            { label: '05:30', value: '05:30' },
            { label: '06:00', value: '06:00' },
            { label: '06:30', value: '06:30' },
            { label: '07:00', value: '07:00' },
            { label: '07:30', value: '07:30' },
            { label: '08:00', value: '08:00' }
        ];
    }

    get optionsTasks() {
        return [
            { label: '+ Create Task', value: 'NewTask', description: 'Create new task' },
            ...this.taskOptions,
        ];
    }

    get ProjectOptions() {
        return [
            { label: '+Create Project', value: 'newProject' },
            ...this.ProjectOption,
        ];
    }

    get ChooseProject() {
        return [   
            ...this.ProjectOption,
        ];
    }




    handleChangeHours(event) {
        this.Hours = event.detail.value;
    }

    handleChangeTasks(event) {
        this.tasksId = event.detail.value;
        if (this.tasksId === 'NewTask') {
            this.CreateTaskTemplate = true;
            this.ShowProjectcombobox = true;
        }
    }

    handleChangeAdditionalmessage(event) {
        this.additionalmessage = event.target.value;
    }

    handleHideModalGlobal() {
        this.CreateTaskTemplate = false;
        this.emptyform();
    }

    handleTaskName(event) {
        this.taskname = event.detail.value;
    }

    handleStartDate(event) {
        this.startdate = event.detail.value;
    }

    createTaskModal() {
        if (this.ProjectNameId || this.taskname || this.startdate != null) {
            CreateTask({ TaskName: this.taskname, ProjectNameId: this.valueproject, StartDate: this.startdate })
                .then((result) => {
                    this.CreateTaskTemplate = false;
                    this.dispatchEvent(new ShowToastEvent({
                        title: "Success",
                        message: result,
                        variant: "success"
                    }));
                    this.fetchalltasks();
                }).catch((error) => {
                    this.dispatchEvent(new ShowToastEvent({
                        title: "Error",
                        message: error.body.message,
                        variant: "error"
                    }));
                });
        } else {
            this.dispatchEvent(new ShowToastEvent({
                title: "Task Error",
                message: "Cannot Create Empty Task",
                variant: "error"
            }));
        }
    }

    fetchalltasks() {
        ReturnAllTasks()
            .then((result) => {
                this.emptyform();
                this.taskOptions = result.map(item => ({ label: item.Name, value: item.Id, description: item.Project__r.Name }));
            }).catch((error) => {
                // Handle error if needed
            });
    }

    HandleSubmitFinalTask() {
        if (this.Hours=='' || this.tasksId=='') {
            this.dispatchEvent(new ShowToastEvent({
                title: "Empty Exception",
                message: "Cannot Submit Empty Record",
                variant: "warning"
            }));
        } else {
            CreateFinalTask({ AdditionalComments: this.additionalmessage, Hours: this.Hours, TaskId: this.tasksId })
            .then((result) => {
                this.dispatchEvent(new ShowToastEvent({
                    title: "Success",
                    message: "Task submitted successfully",
                    variant: "success"
                }));
                this.additionalmessage = null;
                this.emptyform();
            }).catch((err) => {
                console.log(err);
            });
        }
       
    }

    emptyform() {
        const comboBox = this.template.querySelector('[data-id="taskComboBox"]');
        if (comboBox) {
            comboBox.value = '';
        }
        const timecomboBox = this.template.querySelector('[data-id="timeComboBox"]');
        if (timecomboBox) {
            timecomboBox.value = '';
        }
        this.taskname = '';
        this.startdate = '';
        this.valueproject = '';
    }

    handleChangeProjects(event) {
        this.valueproject = event.target.value;
        if (this.valueproject === 'newProject') {
            this.ProjectTemplate = true;
        }
    }
    handlechangeprojectvalue(event) {
        this.projectvalue = event.target.value;
    }

    async handleClickOfAddProject() {
        this.ProjectTemplate = false;
        await this.Createnewproject();
        await this.fetchallprojects();
        this.emptyform();
    }

    fetchallprojects() {
        FetchAllProjects()
            .then((result) => {
                this.ProjectOption = result.map(item => ({ label: item.Name, value: item.Id }));
                this.StoreAllProjectsData = result;
            }).catch((err) => {
                console.error('Error fetching projects:', err);
            });
    }

    Createnewproject() {
        return CreateProject({ ProjectName: this.projectvalue })
            .then((result) => {
                console.log("New project created:", result);
            }).catch((error) => {
                console.error('Error creating project:', error);
            });

    }

    handleClickofaddtask(event) {
        const projectId = event.currentTarget.dataset.id;
        this.valueproject = projectId;
        this.ShowProjectcombobox = false;
        this.CreateTaskTemplate = true;
    }

    handleHideModaltwo() {
        this.ProjectTemplate = false;
        this.emptyform();
    }
    

  
}
