import { Injectable,ApplicationRef  } from '@angular/core';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {MessageService} from 'primeng/api';

@Injectable()
export class ToasterService {
public life=1000;
constructor(private messageService: MessageService) {}


showMessage(severity,detail,summary="") {
 
   if (summary=="") {
     summary= severity.charAt(0).toUpperCase() + severity.slice(1);
   }
    this.messageService.add(
        { severity:severity, summary:summary, detail:detail}        
        );
    console.log(this.messageService);
} 
    addMultiple() {
        this.messageService.addAll([{severity:'success', summary:'Service Message', detail:'Via MessageService'},
                                    {severity:'info', summary:'Info Message', detail:'Via MessageService'}]);
    }
    
    clear() {
        this.messageService.clear();
    }

}