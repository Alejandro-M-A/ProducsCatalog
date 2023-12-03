
namespace com.sap;

entity Products {
     key productsID: Integer;
         name: String(80);
         category: String(80);
}

entity Countries {
            CountryName : String(80);
    key Iso2        : String(2);
    key Iso3        : String(3);
    key Numeric     : Integer;

}