import { LightningElement, track } from 'lwc';
import FetchAllInquiry from '@salesforce/apex/tcsEmployee.FetchAllInquiry';

export default class Inquiries extends LightningElement {



    @track StoreAllInquiries = [];

    connectedCallback() {
        this.FetchAllInquirys();
    }



    FetchAllInquirys() {
        FetchAllInquiry()
            .then((result) => {
                this.StoreAllInquiries = result;
            console.log(JSON.stringify(result));
        }).catch((error) => {
            
        });
    }

    @track Searchkey = '';

    handleKeyUpofsearch(event) {
        this.Searchkey = event.target.value;
        console.log(this.Searchkey);
        this.StoreAllInquiries = this.StoreAllInquiries.filter(item => {
            return item.Name.includes(this.Searchkey);
        });
        if (this.Searchkey.length<2) {
            this.FetchAllInquirys();
        }
    }

    onclickofquirie(event) {
        const recordid = event.currentTarget.dataset.id;
        console.log(recordid);
    }
    
}