const router = require('express').Router();
const { Application, Interview, Test } = require('../models');
// Import the custom middleware
const withAuth = require('../utils/auth');

// Need GET, POST, PUT, and DELETE routes for the job applications.

// These will be presented on the home page after user login using handlebars

// GET all applications for homepage
router.get('/', withAuth, async(req, res) => {

    try {
        const dbApplicationData = await Application.findAll({
            include: [{
                    model: Interview,
                    attributes: ["id", "interview_number", "interview_date", "thank_you_note_sent", "follow_up_email", "application_id"],
                },
                {
                    model: Test,
                    attributes: ["id", "test_date", "concepts", "passed", "application_id"],
                }
            ],
        });

        //   res.status(200).json(dbApplicationData);
        // } catch (err) {
        //   res.status(400).json(err);
        // }

        const applications = dbApplicationData.map((apps) =>
            apps.get({ plain: true })
        );

        res.render('homepage', {
            applications,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post("/", withAuth, async(req, res) => {
    // create a new application
    try {
        const applicationData = await Application.create({
            company_name: req.body.company_name,
            role: req.body.role,
            job_url: req.body.job_url,
            submission_date: req.body.submission_date,
            date_found: req.body.date_found,
            user_id: req.body.user_id,
        });
        // if the application is successfully created, the new response will be returned as json
        res.status(200).json(applicationData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Update an application by id
router.put('/:id', withAuth, async(req, res) => {
    try {
        const applicationData = await Application.update({
            company_name: req.body.company_name,
            role: req.body.role,
            job_url: req.body.job_url,
            submission_date: req.body.submission_date,
            date_found: req.body.date_found,
            user_id: req.body.user_id,
        }, {
            where: {
                id: req.params.id,
            },
        });
        // if the application is successfully updated, the response will be returned as json
        res.status(200).json(applicationData);
    } catch (err) {
        res.status(500).json(err);
    };
});

router.delete("/:id", withAuth, async(req, res) => {
    // delete a application by its `id` value
    try {
        const applicationData = await Application.destroy({
            where: {
                id: req.params.id,
            },
        });

        if (!applicationData) {
            res.status(404).json({ message: "No application found with this id!" });
            return;
        }

        res.status(200).json(applicationData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Login route
router.get('/login', (req, res) => {
    // If the user is already logged in, redirect to the homepage
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    // Otherwise, render the 'login' template
    res.render('login');
});

// Signup route
router.get('/signup', (req, res) => {
    // If the user is already logged in, redirect to the homepage
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    // Otherwise, render the 'signup' template
    res.render('signup');
});


// About us route
router.get('/aboutus', (req, res) => {
    res.render('aboutus');
});

// New job application route
router.get('/newApp', (req, res) => {
    res.render('newApp');
});
// Edit application route
router.get('/editApp', (req, res) => {
    res.render('editApp');
});
// User Info route
router.get('/userInfo', (req, res) => {
    res.render('userInfo');
});



module.exports = router;