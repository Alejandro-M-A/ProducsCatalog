const cds = require("@sap/cds");

module.exports = cds.service.impl(async function (srv) {
    const { Incidents } = this.entities;
    const sapbackend = await cds.connect.to("sapbackend");
    srv.on("READ", Incidents, async (req) => {
        return await sapbackend.tx(req).send({
            query: req.query,
            headers: {
                Authorization: `${process.env.SAP_GATEWAY_AUTH}`
            }
        });
    });
});

// module.exports = async (srv) => {
//     const sapbackend = await cds.connect.to("sapbackend");
//     const { Incidents } = this.entities;

//     srv.on(["READ"], Incidents, async (req) => {
//         let IncidentsQuery = SELECT.from(req.query.SELECT.from).limit(req.query.SELECT.limit);

//         if (req.query.SELECT.where) {
//             IncidentsQuery.where(req.query.SELECT.where);
//         }

//         if (req.query.SELECT.orderBy) {
//             IncidentsQuery.where(req.query.SELECT.orderBy);
//         }

//         let incident = await sapbackend.tx(req).send({
//             query: IncidentsQuery,
//             headers: {
//                 Authorization: "Basic c2FwdWk1OnNhcHVpNQ=="
//             }
//         });

//         let incidents = [];
//         if (Array.isArray(incidents)) {
//             incidents = incident;
//         } else {
//             incidents[0] = incident;
//         }

//         return incidents;

//     });
// };