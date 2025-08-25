function renderFile(res,pageName,title){
    return res.render(`pages/${pageName}`,{title:title})
}
exports.home=(req,res)=>renderFile(res,'index','Bracket Responsive Bootstrap3 Admin');
exports.alerts=(req,res)=>renderFile(res,'alerts','alerts');
exports.blank=(req,res)=>renderFile(res,'blank','blank');
exports.blog_list=(req,res)=>renderFile(res,'blog-list','blog-list');
exports.blog_single=(req,res)=>renderFile(res,'blog-single','blog-single');
exports.bug_issues=(req,res)=>renderFile(res,'bug-issues','bug-issues');
exports.bug_tracker=(req,res)=>renderFile(res,'bug-tracker','bug-tracker');
exports.buttons=(req,res)=>renderFile(res,'buttons','buttons');
exports.calendar=(req,res)=>renderFile(res,'calendar','calendar');
exports.code_editor=(req,res)=>renderFile(res,'code-editor','code-editor');
exports.compose=(req,res)=>renderFile(res,'compose','compose');
exports.email=(req,res)=>renderFile(res,'email','email');
exports.extras=(req,res)=>renderFile(res,'extras','extras');
exports.fixed_width_noleft=(req,res)=>renderFile(res,'fixed-width-noleft','fixed-width-noleft');
exports.fixed_width=(req,res)=>renderFile(res,'fixed-width','fixed-width');
exports.fixed_width2=(req,res)=>renderFile(res,'fixed-width2','fixed-width2');
exports.form_layouts=(req,res)=>renderFile(res,'form-layouts','form-layouts');
exports.form_validation=(req,res)=>renderFile(res,'form-validation','form-validation');
exports.form_wizards=(req,res)=>renderFile(res,'form-wizards','form-wizards');
exports.general_forms=(req,res)=>renderFile(res,'general-forms','general-forms');
exports.graphs=(req,res)=>renderFile(res,'graphs','graphs');
exports.horizontal_menu=(req,res)=>renderFile(res,'horizontal-menu','horizontal-menu');
exports.horizontal_menu2=(req,res)=>renderFile(res,'horizontal-menu2','horizontal-menu2');
exports.icons=(req,res)=>renderFile(res,'icons','icons');
exports.invoice=(req,res)=>renderFile(res,'invoice','invoice');
exports.layouts=(req,res)=>renderFile(res,'layouts','layouts');
exports.locked=(req,res)=>renderFile(res,'locked','locked');
exports.maps=(req,res)=>renderFile(res,'maps','maps');
exports.media_manager=(req,res)=>renderFile(res,'media-manager','media-manager');
exports.modals=(req,res)=>renderFile(res,'modals','modals');
exports.notfound=(req,res)=>renderFile(res,'notfound','notfound');
exports.people_directory=(req,res)=>renderFile(res,'people-directory','people-directory');
exports.profile=(req,res)=>renderFile(res,'profile','profile');
exports.read=(req,res)=>renderFile(res,'read','read');
exports.search_results=(req,res)=>renderFile(res,'search-results','search-results');
exports.singin=(req,res)=>renderFile(res,'signin','singin');
exports.signup=(req,res)=>renderFile(res,'signup','signup');
exports.sliders=(req,res)=>renderFile(res,'sliders','sliders');
exports.tables=(req,res)=>renderFile(res,'tables','tables');
exports.tabs_accordions=(req,res)=>renderFile(res,'tabs-accordions','tabs-accordions');
exports.timeline=(req,res)=>renderFile(res,'timeline','timeline');
exports.typography=(req,res)=>renderFile(res,'typography','typography');
exports.view_issue=(req,res)=>renderFile(res,'view-issue','view-issue');
exports.widgets=(req,res)=>renderFile(res,'widgets','widgets');
exports.wysiwyg=(req,res)=>renderFile(res,'wysiwyg','wysiwyg');
exports.x_editable=(req,res)=>renderFile(res,'x-editable','x-editable');

exports.login_page= async(req,res,next)=>{
    try{
        const{Username,Password}=req.body;
        console.log(Username,Password)
       await res.render('pages/index',{title:'Home'})
    }catch(error){
        next(error);
    }
};

//ajax

function ajaxFolder(res,fileName,title){
    return res.render(`ajax/${fileName}`, {title:title})
};

exports.accordion=(req,res)=>ajaxFolder(res,'accordion','accordion')
exports.panel=(req,res)=>ajaxFolder(res,'panel','panel')
exports.photo_viewer_rtl=(req,res)=>ajaxFolder(res,'photo-viewer-rtl','photo-viewer-rtl')
exports.photo_viewer=(req,res)=>ajaxFolder(res,'photo-viewer','photo-viewer')
exports.remote=(req,res)=>ajaxFolder(res,'remote','remote')
exports.tabs=(req,res)=>ajaxFolder(res,'tabs','tabs')



