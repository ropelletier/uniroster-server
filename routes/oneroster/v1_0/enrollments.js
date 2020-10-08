const db = require('../../../utils/database');
const router = require('express').Router();
const table = 'enrollments';

function buildEnrollment(row, hrefBase, metaFields) {
    const enrollment = {
        sourcedId: row.sourcedId,
        status: row.status ? row.status : "active",
        dateLastModified: row.dateLastModified,
        userSourcedId: row.userSourcedId,
        classSourcedId: row.classSourcedId,
        schoolSourcedId: row.schoolSourcedId,
        role: row.role,
        primary: row.primary
    };
  
    if (metaFields.length > 0) {
        enrollment.metadata = {}
        metaFields.forEach(function(field) {
            enrollment.metadata[field.jsonColumn] = row[field.dbColumn];
        });
    }
  
    return enrollment;
};

function buildEnrollmentsFromData(res, data) {
    const enrollments = [];
    data.results.forEach(function(row) {
        enrollments.push(buildEnrollment(row, data.hrefBase, data.fields.metaFields));
    });
    res.json({enrollments: enrollments});
};

function queryEnrollment(req, res, next) {
    db.getData(req, res, {
        table: table,
        queryValues: [req.params.id],
        additionalWhereStmts: 'sourceId = ?'
    }).then((data) => {
        res.json({
            enrollment: buildEnrollment(data.results[0], data.hrefBase, data.fields.metaFields)
        })
    });
};

function queryEnrollments(req, res, next) {
    db.getData(req, res, {
        table: table
    }).then((data) => {
        buildEnrollmentsFromData(res, data);
    });
};

function queryEnrollmentsBySchool(req, res, next) {
    db.getData(req, res, {
        table: table,
        queryValues: [req.params.sid, req.params.cid],
        additionalWhereStmts: `schoolSourcedId = ?${req.params.cid ? ' AND classSourcedId = ?' : ''}`
    }).then((data) => {
        buildEnrollmentsFromData(res, data);
    });
};

router.get('/enrollments', function(req, res, next) {
  queryEnrollments(req, res, next);
});

router.get('/enrollments/:id', function(req, res, next) {
  queryEnrollment(req, res, next);
});

router.get('/schools/:sid/enrollments', function(req, res, next) {
  queryEnrollmentsBySchool(req, res, next);
});

router.get('/schools/:sid/classes/:cid/enrollments', function(req, res, next) {
  queryEnrollmentsBySchool(req, res, next);
});

module.exports = router;
