const cds = require("@sap/cds");
const { Console } = require("console");
const { Orders } = cds.entities("com.training");

module.exports = (srv) => {

    //***************READ***********/
    srv.on("READ", "GetOrders", async (req) => {

        if (req.data.ClientEmail !== undefined) {
            return await SELECT.from`com.training.Orders`
                .where`ClientEmail = ${req.data.ClientEmail}`;
        }
        return await SELECT.from(Orders);
    });

    srv.after("READ", "GetOrders", (data) => {
        return data.map((order) => (order.Reviewed = true));
    });

    //***********CREATE*******/
    srv.on("CREATE", "CreateOrder", async (req) => {
        let returnData = await cds
            .transaction(req)
            .run(
                INSERT.into(Orders).entries({
                    ClientEmail: req.data.ClientEmail,
                    FirstName: req.data.FirstName,
                    LastName: req.data.LastName,
                    CreatedOn: req.data.CreatedOn,
                    Reviewed: req.data.Reviewed,
                    Approved: req.data.Approved,
                })
            ).then((resolve, reject) => {
                console.log("Resolve", resolve);
                console.log("Reject", reject);

                if (typeof resolve !== "undefined") {
                    return req.data;
                } else {
                    req.error(409, "Record nor Inserted");
                }
            }).catch((err) => {
                console.log(err);
                req.error(err.code, err.message);
            });
        return returnData;
    });

    srv.before("CREATE", "CreateOrder", (req) => {
        req.data.CreatedOn = new Date().toISOString().slice(0, 10);
        return req;
    });

    //***********UPDATE*******/
    srv.on("UPDATE", "UpdateOrder", async (req) => {
        let returnData = await cds.transaction(req).run(
            [
                UPDATE(Orders, req.data.ClientEmail).set({
                    FirstName: req.data.FirstName,
                    LastName: req.data.LastName
                }),
            ]
        ).then((resolve, reject) => {
            console.log("Resolve: ", resolve[0]);
            console.log("Reject: ", reject);

            if (resolve[0] == 0) {
                req.error(409, "Record not found");
            }
        }).catch((err) => {
            console.log(err);
            req.error(err.code, err.message);
        });
        console.log("Befor End: ", returnData);
        return returnData;
    });

    //***********DELETE*******/
    srv.on("DELETE", "DeleteOrder", async (req) => {
        let returnData = await cds.transaction(req).run(
            DELETE.from(Orders).where({
                ClientEmail: req.data.ClientEmail
            })
        ).then((resolve, reject) => {
            console.log("Resolve: ", resolve[0]);
            console.log("Reject: ", reject);

            if (resolve !== 1) {
                req.error(409, "Record not found");
            }
        }).catch((err) => {
            console.log(err);
            req.error(err.code, err.message);
        });
        console.log("Befor End: ", returnData);
        return await returnData;
    })

};