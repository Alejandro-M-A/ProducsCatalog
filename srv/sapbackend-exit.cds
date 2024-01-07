using { sapbackend as external } from './external/sapbackend.csn';

define service sapbackendExit {
    @cds.persistence : {
        table,
        skip: false
    }
    @cds.autoexpose
    entity Incidents as projection on  external.IncidentsSet;
    
}

@protocol: 'rest'
service RestService {
    entity Incidents as projection on sapbackendExit.Incidents;

}
