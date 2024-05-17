public without sharing class tcsEmployee {
    
    @AuraEnabled
    public static List<Task__c> ReturnAllTasks(){
        String userEmail = UserInfo.getUserEmail();
        
        Account acc = [SELECT Id, Email__c FROM Account WHERE Email__c = :userEmail LIMIT 1];
        
        return [Select Id,Additional_Comments__c,Start_Date__c,Total_hours__c,Name,Account__c From Task__c where Account__c=:acc.Id AND CreatedDate =today];
    }
    
    
    @AuraEnabled
    public static String CreateTask(String TaskName, String ProjectNameId, Date StartDate) {
        String userEmail = UserInfo.getUserEmail();
        
        Account acc = [SELECT Id, Email__c FROM Account WHERE Email__c = :userEmail LIMIT 1];
        
        Task__c task = new Task__c();
        task.Project__c = ProjectNameId;
        task.Name = TaskName;
        task.Start_Date__c = StartDate;
        task.Account__c = acc.Id;
        
        insert task;
        return 'Task Inserted Successfully';
    }
    
    
    @AuraEnabled
    Public Static String CreateFinalTask(String AdditionalComments ,String Hours, String TaskId){
        
        List<Task__c> task =[Select Id, Additional_Comments__c, Total_hours__c From Task__c Where Id=:TaskId ];
        
        for(Task__c tas:task){
            tas.Additional_Comments__c=AdditionalComments;
            tas.Total_hours__c =Hours;
            update tas;
        }
        return 'Task Updated Successfull';
    }
    
    
    @AuraEnabled
    public static List<Project__c> FetchAllProjects(){
        return [Select Id, Name From Project__c where CreatedDate =today];
    }
    
    
    @AuraEnabled
    public static Project__c CreateProject(String ProjectName){
        Project__c pro = new Project__c();
        pro.Name=ProjectName;
        Insert pro;
        return pro;
    }
}