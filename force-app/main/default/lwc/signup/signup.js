import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
export default class Signup extends NavigationMixin (LightningElement) {
    @track options = [
        { label: 'TCS Employee', value: '00edL0000015IUUQA2' },
        { label: 'TCS Hr', value: '00edL0000015SkfQAE' }
    ];

    @track formData = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        Profile: '',
        termsAccepted: false
    };

    handlechange(event) {
        const field = event.target.name;
        const Storevalue = event.target;
      if (field =='FirstName') {
          this.formData.firstName = Storevalue.value;
      }else if (field =='LastName') {
        this.formData.lastName = Storevalue.value;
      }else if (field =='Email') {
        this.formData.email = Storevalue.value;
      }else if (field =='Password') {
        this.formData.password = Storevalue.value;
      }else if (field =='Profile') {
        this.formData.Profile = Storevalue.value;
      }else if (field =='checkbox') {
          this.formData.termsAccepted = Storevalue.checked;
          console.log(this.formData.termsAccepted);
      }
    }

    handleSignup() {
        if (this.formData.termsAccepted == true) {
            tcsSignup({firstName:this.formData.firstName, lastName:this.formData.lastName,  email:this.formData.email, Phone:this.formData.Phone, Password:this.formData.Phone, ProfileId:this.formData.Profile})
                .then((result) => {
                this.dispatchEvent(new ShowToastEvent({
                    title: "Registered Successfull",
                    message: result,
                    variant: "success"
                }));
                this[NavigationMixin.Navigate]({
                    type: "standard__webPage",
                    attributes: {
                       url: 'https://thecodingstudio4-dev-ed.develop.my.site.com/thecodingstudio/s/login/'
                    }
                });
            }).catch((error) => {
                this.dispatchEvent(new ShowToastEvent({
                    title: "Error Login",
                    message: error.body.message,
                    variant: "error"
                }));
            });
        } else { 
            this.dispatchEvent(new ShowToastEvent({
                title: "Error Login",
                message: "Error While Logging in",
                variant: "error"
            }));
        }
    }
}
