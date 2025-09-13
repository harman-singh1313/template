const { render } = require('ejs');
// const { response } = require("express");
const { readeEmail } = require("../services/imapService");

const { MongoClient, ObjectId } = require('mongodb');
require("dotenv").config();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri)



async function renderFile(req, res, pageName, title) {
    //agar lead page run hoga to condetion chale ge
    if (pageName == 'leads') {
        await client.connect();
        await client.db("portfolioDB").command({ ping: 1 }); //command is a low level method they send direct command to mongo db  --> ping check mongodb is connected or not
        console.log('mongodb successfuly connent')
        const database = client.db("portfolioDB"); //
        const myCollection = database.collection("Users")
        const result = await myCollection.find().toArray(); // jo collection vicho data au onu array vich convert karan laye toArray
        console.log(result)

        return res.render(`pages/${pageName}`, { data: result })  // result mtlb data aeya collections vicho onu leads page tey send karna  
    }


    else if (pageName == 'leadsEdit') {
        const objectId = ObjectId.createFromHexString(req.query.id);
        console.log(`Your reqested id is ${objectId}`);
        const query = { _id: objectId };
        await client.connect();
        await client.db("portfolioDB").command({ ping: 1 }); //command is a low level method they send direct command to mongo db  --> ping check mongodb is connected or not
        console.log('mongodb successfuly connent')
        const database = client.db("portfolioDB"); //
        const myCollection = database.collection("Users")

        if (req.method == "POST") {
            console.log('Post Data Received...');
            console.log(req.body);
            const newFolloUp = req.body;

            const folloUp_update = await myCollection.updateOne(query, { $push: { FolloUp: newFolloUp } });

            console.log("Matched:", folloUp_update.matchedCount, "Modified:", folloUp_update.modifiedCount);
        }

        const result = await myCollection.findOne(query); // jo collection vicho data au onu array vich convert karan laye toArray
        console.log(result);

        return res.render(`pages/${pageName}`, { data: result });

    }
    return res.render(`pages/${pageName}`, { title }); //agar if condetion nahi chalde ta page page runn hon gey

}


exports.signin = (req, res) => renderFile(req, res, 'signin', 'singin');
exports.leadsEdit = (req, res) => renderFile(req, res, 'leadsEdit', 'leadsEdit');

exports.home = (req, res) => renderFile(req, res, 'index', 'Bracket Responsive Bootstrap3 Admin');
exports.alerts = (req, res) => renderFile(req, res, 'alerts', 'alerts');
exports.blank = (req, res) => renderFile(req, res, 'blank', 'blank');
exports.leads = (req, res) => renderFile(req, res, 'leads', 'leads');
exports.blog_list = (req, res) => renderFile(req, res, 'blog-list', 'blog-list');
exports.blog_single = (req, res) => renderFile(req, res, 'blog-single', 'blog-single');
exports.bug_issues = (req, res) => renderFile(req, res, 'bug-issues', 'bug-issues');
exports.bug_tracker = (req, res) => renderFile(req, res, 'bug-tracker', 'bug-tracker');
exports.buttons = (req, res) => renderFile(req, res, 'buttons', 'buttons');
exports.calendar = (req, res) => renderFile(req, res, 'calendar', 'calendar');
exports.code_editor = (req, res) => renderFile(req, res, 'code-editor', 'code-editor');
exports.compose = (req, res) => renderFile(req, res, 'compose', 'compose');
exports.email = (req, res) => renderFile(req, res, 'email', 'email');
exports.extras = (req, res) => renderFile(req, res, 'extras', 'extras');
exports.fixed_width_noleft = (req, res) => renderFile(req, res, 'fixed-width-noleft', 'fixed-width-noleft');
exports.fixed_width = (req, res) => renderFile(req, res, 'fixed-width', 'fixed-width');
exports.fixed_width2 = (req, res) => renderFile(req, res, 'fixed-width2', 'fixed-width2');
exports.form_layouts = (req, res) => renderFile(req, res, 'form-layouts', 'form-layouts');
exports.form_validation = (req, res) => renderFile(req, res, 'form-validation', 'form-validation');
exports.form_wizards = (req, res) => renderFile(req, res, 'form-wizards', 'form-wizards');
exports.general_forms = (req, res) => renderFile(req, res, 'general-forms', 'general-forms');
exports.graphs = (req, res) => renderFile(req, res, 'graphs', 'graphs');
exports.horizontal_menu = (req, res) => renderFile(req, res, 'horizontal-menu', 'horizontal-menu');
exports.horizontal_menu2 = (req, res) => renderFile(req, res, 'horizontal-menu2', 'horizontal-menu2');
exports.icons = (req, res) => renderFile(req, res, 'icons', 'icons');
exports.invoice = (req, res) => renderFile(req, res, 'invoice', 'invoice');
exports.layouts = (req, res) => renderFile(req, res, 'layouts', 'layouts');
exports.locked = (req, res) => renderFile(req, res, 'locked', 'locked');
exports.maps = (req, res) => renderFile(req, res, 'maps', 'maps');
exports.media_manager = (req, res) => renderFile(req, res, 'media-manager', 'media-manager');
exports.modals = (req, res) => renderFile(req, res, 'modals', 'modals');
exports.notfound = (req, res) => renderFile(req, res, 'notfound', 'notfound');
exports.people_directory = (req, res) => renderFile(req, res, 'people-directory', 'people-directory');
exports.profile = (req, res) => renderFile(req, res, 'profile', 'profile');
exports.read = (req, res) => renderFile(req, res, 'read', 'read');
exports.search_results = (req, res) => renderFile(req, res, 'search-results', 'search-results');
exports.signup = (req, res) => renderFile(req, res, 'signup', 'signup');
exports.sliders = (req, res) => renderFile(req, res, 'sliders', 'sliders');
exports.tables = (req, res) => renderFile(req, res, 'tables', 'tables');
exports.tabs_accordions = (req, res) => renderFile(req, res, 'tabs-accordions', 'tabs-accordions');
exports.timeline = (req, res) => renderFile(req, res, 'timeline', 'timeline');
exports.typography = (req, res) => renderFile(req, res, 'typography', 'typography');
exports.view_issue = (req, res) => renderFile(req, res, 'view-issue', 'view-issue');
exports.widgets = (req, res) => renderFile(req, res, 'widgets', 'widgets');
exports.wysiwyg = (req, res) => renderFile(req, res, 'wysiwyg', 'wysiwyg');
exports.x_editable = (req, res) => renderFile(req, res, 'x-editable', 'x-editable');
exports.read_email = (req, res) => renderFile(req, res, 'read_email', 'read_email');



exports.imapService = async (req, res) => {
    try {
        const emails = await readeEmail(); // make sure the function name is correct
        console.log("Emails fetched:", emails);

        res.render('pages/read_email', { data: emails }); // fallback to empty array
    } catch (err) {
        res.status(500).json({ success: false, error: err.message || err });
    }
};




exports.login_page = async (req, res, next) => {
    try {
        // const{Username,Password}=req.body;
        const { Username, Password, } = req.body;
        await client.connect();
        await client.db("portfolioDB").command({ ping: 1 });
        console.log("page connect successfully");

        const db = client.db("portfolioDB");
        const mycoll = db.collection("Users");

        const send = await mycoll.find({ email: Username.trim(), password: Password.trim() }).toArray()
        console.log(send)
        if (send.length > 0) {
            // res.send("success")
            res.render("pages/index", { title: "Breket" });
        }


        else {
            res.send("wrong user details")
        }

    } catch (error) {
        next(error);
    }
};

exports.signup_data = async (req, res, next) => {
    try {
        const body_data = req.body;
        console.log(body_data)
        res.render('pages/index', { title: 'Home' })
    } catch (error) {
        next(error)
    }
}
//ajax

function ajaxFolder(res, fileName, title) {
    return res.render(`ajax/${fileName}`, { title: title })
};

exports.accordion = (req, res) => ajaxFolder(res, 'accordion', 'accordion')
exports.panel = (req, res) => ajaxFolder(res, 'panel', 'panel')
exports.photo_viewer_rtl = (req, res) => ajaxFolder(res, 'photo-viewer-rtl', 'photo-viewer-rtl')
exports.photo_viewer = (req, res) => ajaxFolder(res, 'photo-viewer', 'photo-viewer')
exports.remote = (req, res) => ajaxFolder(res, 'remote', 'remote')
exports.tabs = (req, res) => ajaxFolder(res, 'tabs', 'tabs')



