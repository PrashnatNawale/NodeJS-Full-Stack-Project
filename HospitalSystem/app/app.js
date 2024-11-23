import mysql from "mysql";
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import ejs from "ejs";
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "PRASHANT70nawale38@",
    database: "ayushmanhospital"
});
connection.connect((err, data) => {
    if (err) {
        console.log("Database is not connected");
    } else {
        console.log("Connection with ayushmanhospital Established..");
    }
});



const app = express();
const staticpath = "D:\\User\\admin\\Desktop\\DataBase\\Projects\\HospitalSystem\\template"
app.use(express.static(staticpath));
app.engine('html', ejs.renderFile)
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render(staticpath + "//index.html");
});
app.post("/fixappointment", (req, res) => {
    var pid = req.body.pid;
    var ddepartment = req.body.department;

    function updatestatus(did, time) {
        var query1 = `UPDATE appointment SET status=1,did=${did},treatmenttime='${time}'  WHERE(pid=${pid} AND department='${ddepartment}' AND status=${0});`
        connection.query(query1, (err, data) => {
            res.render(staticpath + "//allocateappointment.html");
        });

    }
    var query = `SELECT * FROM appointment WHERE pid=${pid} AND status=1`;
    connection.query(query, (err, data) => {
        if (data.length == 0) {
            var query1 = `SELECT did FROM doctor WHERE did NOT IN (SELECT DISTINCT(did) FROM appointment WHERE department='${ddepartment}' AND status=${1}) AND ddepartment='${ddepartment}' ;`

            connection.query(query1, (err, data) => {
                if (data.length > 0) {
                    var date = new Date();
                    var hour = date.getHours();
                    var minutes = date.getMinutes();
                    if (minutes < 30) {
                        minutes = 30;
                    } else {
                        minutes = 0;
                        hour += 1;
                        if (hour == 24) {
                            hour = 0;
                        }
                    }
                    var time = `${hour}:${minutes}:00`;
                    updatestatus(data[0]['did'], time)

                } else {
                    var query2 = `select did from appointment where (status=1 and department='${ddepartment}') GROUP BY did ORDER BY count(*) LIMIT 1;`
                    connection.query(query2, (err, data1) => {
                        var did = data1[0]['did'];
                        var query = `select max(treatmenttime) as time from appointment where did=${did} and status=1`;
                        connection.query(query, (err, data) => {
                            var time = data[0]['time'];
                            console.log(data);
                            time = time.split(':');
                            var hour = parseInt(time[0]),
                                minutes = parseInt(time[1]);
                            if (minutes == 0) {
                                minutes = 30;
                            } else {
                                minutes = 0;
                                hour += 1;
                                if (hour == 24) {
                                    hour = 0;
                                }
                            }
                            time = `${hour}:${minutes}:00`;
                            updatestatus(did, time)
                        })
                    });
                }
            });
        } else {
            res.render(staticpath + "//allocateappointment.html");
        }
    });

});
app.get("/allocateappointment", (req, res) => {
    var query = `SELECT  ap.pid as pid,concat(p.pfname," ",p.plname) as pname,DATE_FORMAT(ap.requestdate, " %D %M %Y") as pdate,ap.purpose as ppurpose,ap.department as pdepartment FROM appointment AS ap,patient AS p  WHERE ap.pid=p.pid  AND ap.status=${0} ORDER BY pdate;`
    connection.query(query, (err, data) => {
        res.send(JSON.stringify(data));
    });
})
app.get("/viewappointment", (req, res) => {
    var query1 = ` SELECT a.pid as pid,a.did as did,concat(p.pfname," ",p.plname) as pname,concat(d.dfname," ",d.dlname) as dname,a.purpose as problem,a.department as department FROM appointment AS a,patient AS p,doctor AS d WHERE a.pid=p.pid AND a.status=${1} AND a.did=d.did;`;
    connection.query(query1, (err, data) => {
        res.send(JSON.stringify(data));
    });
});

// Information about patient resistration
app.post("/drresistration", (req, res) => {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var contact = req.body.contact;
    var adhar = req.body.adhar;
    var gender = req.body.gender;
    var department = req.body.department;
    var email = req.body.email;
    var date = new Date();
    var doj = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    var address1 = req.body.address1;
    var address2 = req.body.address2;
    var pass = "Pass@123";
    console.log(doj);
    var query1 = `INSERT INTO doctor VALUES (null,'${fname}','${lname}','${contact}','${adhar}','${gender}','${department}','${email}','${doj}','${address1}','${address2}','${pass}')`;


    connection.query(query1, (err, data) => {
        console.log(err);
        console.log(data)
        res.render(staticpath + "//allocateappointment.html");
    })
});

app.post("/adminLogin", (req, res) => {
    var mail = req.body.mail;
    var pass = req.body.pass;
    var query1 = `SELECT * FROM admin`;
    connection.query(query1, (err, data) => {
        if (err) {
            console.log("error");
        }
        if (data.length == 0) {
            res.redirect(staticpath + "//index.html");
        } else {
            res.sendFile(staticpath + "//allocateappointment.html");
        }
    });
});
app.post("/resistrationdata", (req, res) => {
    const fname = req.body.pfname;
    const lname = req.body.plname;
    const gender = req.body.pgender;
    const contact1 = req.body.pcontact1;
    const contact2 = req.body.pcontact2;
    const adhar = req.body.padhar;
    const occupation = req.body.poccupation;
    const address = req.body.paddress;
    const email = req.body.pemail;
    var rfname = req.body.rfname;
    var rlname = req.body.rlname;
    var rcontact = req.body.rcontact;
    var rrelation = req.body.rrelation;
    var roccupation = req.body.roccupation;
    var radhar = req.body.radhar;
    var raddress1 = req.body.raddress;
    var pdob = req.body.pdob;
    var pallergy = req.body.pallergy;
    var pbloodgroup = req.body.pbloodgroup;
    var pweight = req.body.pweight;
    var pdisease = req.body.pdisease;

    console.log(pdob);
    var query = `SELECT rid FROM relative WHERE radhar='${radhar}' `;
    var query2 = `SELECT pid FROM patient WHERE padhar='${adhar}'`;
    var query3 = `INSERT INTO relative VALUES (null,'${rfname}','${rlname}','${rcontact}','${radhar}','${roccupation}','${raddress1}')`;
    var rid;
    connection.query(query, (err, data) => {
        if (data.length == 0) {
            connection.query(query3, (err, data1) => {
                rid = data1.insertId;
                insertpatientinfo(rid);
            });
        } else {
            rid = data[0].rid;
            insertpatientinfo(rid);
        }

    });

    function insertpatientinfo(rid) {
        var query1 = `INSERT INTO patient VALUES (null,'${fname}','${lname}','${gender}','${contact1}','${contact2}','${adhar}','${occupation}','${address}','${rid}','${rrelation}','${email}')`;
        connection.query(query1, (err, data) => {
            console.log(data);
            var pid = data.insertId;
            var query4 = `INSERT INTO pmedicalhistroy VALUES ('${pid}','${pdob}','${pallergy}','${pbloodgroup}','${pweight}','${pdisease}')`;
            connection.query(query4, (err, data1) => {
                console.log(data1);
                res.sendFile(staticpath + "//appointment.html");
            });
        });
    }
});

app.get("/dgetlist/:email", (req, res) => {
    let email = req.params.email;
    var query1 = `SELECT did FROM doctor WHERE demail='${email}'`;
    connection.query(query1, (err, data) => {
        var did = data[0]['did'];
        var query2 = ` SELECT CONCAT(p.pfname," ",p.plname) AS name,a.purpose as problem,h.pallergy AS allergy,h.pbloodgroup AS bgroup,h.pdisease AS pastdisease,h.pweight AS weight,datediff(current_date,h.pdob)/365 AS age,p.pid as pid,a.treatmenttime as treatmenttime FROM appointment AS a,patient AS p,pmedicalhistroy as h WHERE p.pid=a.pid=h.pid AND did=${did} AND  a.status=1 ORDER BY a.requestdate,a.treatmenttime;`;
        connection.query(query2, (err, data) => {
            res.send(JSON.stringify(data));
        });
    });
});
app.get("/pgetdetails/:email", (req, res) => {
    let email = req.params.email;
    var query = `SELECT pfname,plname FROM patient WHERE email='${email}'`;
    connection.query(query, (err, data) => {
        res.send(JSON.stringify(data));
    });
});
app.get("/dpastlist/:email", (req, res) => {
    let email = req.params.email;
    var query1 = `SELECT did FROM doctor WHERE demail='${email}'`;
    connection.query(query1, (err, data) => {
        var did = data[0]['did'];
        var query2 = ` SELECT CONCAT(p.pfname," ",p.plname) AS name,a.purpose as problem,h.pallergy AS allergy,h.pbloodgroup AS bgroup,h.pdisease AS pastdisease,h.pweight AS weight,datediff(current_date,h.pdob)/365 AS age,DATE_FORMAT(a.treatmentdate,"%d/%m/%y") as treatmentdate FROM appointment AS a,patient AS p,pmedicalhistroy as h WHERE p.pid=a.pid=h.pid AND did=${did} AND  a.status=2 ORDER BY treatmentdate DESC;`;
        connection.query(query2, (err, data) => {
            res.send(JSON.stringify(data));
        });
    });
});
app.get("/dgetprescription/:docs", (req, res) => {
    var docs = req.params.docs;
    docs = JSON.parse(docs);
    var query = `SELECT * FROM doctor WHERE demail='${docs['demail']}'`;
    connection.query(query, (err, data) => {
        var department = data[0]['ddepartment'];
        query = `SELECT a.purpose as purpose,concat(d.dfname,' ',d.dlname) AS name,a.prescription AS prescription,DATE_FORMAT(a.treatmentdate,"%d/%m/%y") AS treatmentdate FROM appointment AS a INNER JOIN doctor AS d ON d.did=a.did WHERE a.pid=${docs['pid']} AND a.department='${department}' AND a.status=2 ORDER BY a.treatmentdate DESC`;
        connection.query(query, (err, data) => {
            res.send(data);
        });
    });
});
app.get("/pgetactivelist/:email", (req, res) => {
    let email = req.params.email;
    var query1 = `SELECT pid FROM patient WHERE email='${email}'`;
    connection.query(query1, (err, data) => {
        let pid = data[0]['pid'];
        var query2 = `SELECT  a.did,concat(d.dfname," ",d.dlname)AS dname,a.purpose AS problem,a.department AS department,DATE_FORMAT(a.requestdate,"%d/%m/%y") AS date,a.requestdate as requestdate,a.treatmenttime as treatmenttime FROM appointment AS a,doctor AS d WHERE a.did=d.did AND pid=${pid} AND a.status=1 ORDER BY date`;
        connection.query(query2, (err, data1) => {
            res.send(JSON.stringify(data1));
        });
    });
});
app.get("/pgetpastlist/:email", (req, res) => {
    let email = req.params.email;
    var query1 = `SELECT pid FROM patient WHERE email='${email}'`;
    connection.query(query1, (err, data) => {
        let pid = data[0]['pid'];
        var query2 = `SELECT  a.did,concat(d.dfname," ",d.dlname)AS dname,a.purpose AS problem,a.prescription AS department,DATE_FORMAT(a.requestdate,"%d/%m/%y") AS date1,DATE_FORMAT(a.treatmentdate,"%d/%m/%y") AS date2,a.expances AS expances FROM appointment AS a,doctor AS d WHERE a.did=d.did AND a.status=2 AND pid=${pid} ORDER BY date1`;
        connection.query(query2, (err, data1) => {
            res.send(JSON.stringify(data1));
        });
    });
});
app.post("/doctorlogin", (req, res) => {
    var mail = req.body.mail;
    var pass = req.body.pass;
    var query1 = `SELECT did FROM doctor WHERE demail='${mail}' AND  passward='${pass}'`;
    connection.query(query1, (err, data) => {
        if (data.length == 1) {
            res.render(staticpath + "//dappointment.html");
        } else {
            res.render(staticpath + "//index.html");
        }
    });
});
app.post("/submitappointment", (req, res) => {
    var pid = req.body.pid;
    var prescription = req.body.prescription;
    var cost = req.body.cost;
    var dmail = req.body.demail;
    var date = new Date();
    var tdate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    var query1 = `SELECT did FROM doctor WHERE demail='${dmail}'`;
    connection.query(query1, (err, data) => {
        var did = data[0]['did'];
        var query2 = `UPDATE appointment SET prescription='${prescription}',expances=${cost},treatmentdate='${tdate}',status=2 WHERE status=1 AND did=${did} AND pid=${pid}`;
        connection.query(query2, (err, data1) => {
            res.render(staticpath + "//dappointment.html");
        })
    });
});
app.post("/appointmentdata", (req, res) => {
    var pemail = req.body.pemail;
    var pvisit = req.body.pvisit;
    var pdoctor = req.body.pdoctor;
    var date = new Date();
    var tdate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    var query = `SELECT pid FROM patient WHERE email='${pemail}'`;
    connection.query(query, (err, data) => {
        if (data.length == 1) {
            var pid = data[0].pid;
            console.log("server come here");
            var query1 = `INSERT INTO appointment VALUES(${pid},'${pvisit}','${pdoctor}',0,'${tdate}',null,null,null,null,null)`;
            connection.query(query1, (err, data) => {
                res.render(staticpath + "//pvappointment.html");
            });
        } else {
            res.render(staticpath + "//resistration.html")
        }
    });
});
app.post("/patientlogin", (req, res) => {
    var email = req.body.mail;
    var query1 = `SELECT * FROM patient WHERE email='${email}'`;
    connection.query(query1, (err, data) => {
        if (data.length == 1) {
            res.render(staticpath + "//appointment.html");
        } else {
            res.render(staticpath + "//resistration.html");
        }
    });
});
app.listen(8000);