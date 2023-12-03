using {com.sap as call } from '../db/schema';

service ProductsService {

    entity Products as projection on call.Products;

    

}
