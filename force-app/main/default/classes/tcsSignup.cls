public without sharing class tcsSignup {
    
    @AuraEnabled 
    public static String createAccountAndContact(String firstName, String lastName, String email, String Phone, String Password,String ProfileId ) {
 
            // Creating Account
            Account acc = new Account();
            acc.Name = firstName + ' ' + lastName;
            acc.Email__c = email;
            acc.Phone = Phone;
            insert acc;
            System.debug('Account Inserted: ' + acc);
            
            // Creating Contact
            Contact con = new Contact();
            con.AccountId = acc.Id;
            con.FirstName = firstName;
            con.LastName = lastName;
            con.Email = email;
            con.Phone = Phone;
            insert con;
            System.debug('Contact Inserted: ' + con);
            
            // Creating User
            User user = new User();
            user.Username = email;
            user.ContactId = con.Id;
            user.LastName = lastName;
            user.FirstName = firstName;
            // user.ManagerId = '2F0055j000009Kb7q';
            user.Email = email;
            user.Alias = 'U-' + String.valueOf(Crypto.getRandomInteger()).substring(0, 6);
            user.CommunityNickname = email;
            user.TimeZoneSidKey = 'GMT';
            user.LocaleSidKey = 'en_US';
            user.EmailEncodingKey = 'UTF-8';
            Profile desiredProfile = [SELECT Id FROM Profile WHERE Id=: ProfileId LIMIT 1];
            user.ProfileId = desiredProfile.Id;
            user.LanguageLocaleKey = 'en_US';
            user.IsActive = true;
            insert user;
            System.debug('User Inserted: ' + user);
            
            // Setting Password
            System.setpassword(user.Id, Password);
            
            // Logging in
            ApexPages.PageReference pageRef = Site.login(user.Username, Password, '/thecodingstudio/s');
            System.debug('User Logged In'+pageRef);
        
            return pageRef.getUrl();
         
    }
}