import { LightningElement, api } from 'lwc';

export default class Modal extends LightningElement {


    hideModalBoxGlobal() {
        const event = new CustomEvent("hidemodalgloble");
        this.dispatchEvent(event);
    }

}
