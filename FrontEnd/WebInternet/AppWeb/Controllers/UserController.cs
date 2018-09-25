using AppServices.Models;
using AppServices.Service;
using System;
using System.Web.Mvc;


namespace AppWeb.Controllers
{
    public class UserController : BaseController
    {
        // GET: User
        public ActionResult Index()
        {
            return View();
        }

        [ActionName("login"), HttpGet]
        public ActionResult Login()
        {
            UserModel item = (UserModel)this.Session["user"];
            if (item != null)
            {
                if (item.IsDefault == false)
                {
                    if (Request.UrlReferrer == null)
                        return new RedirectResult(Url.Content("~") + BaseController.DEFAULTINDEX);
                    else
                        return new RedirectResult(Request.UrlReferrer.ToString());//Request.Headers["Referer"]
                }
                else
                {
                    try
                    {
                        return View("Login");
                    }
                    catch (Exception ex)
                    {
                        this.ViewBag.Message = ex.Message;
                        return View("../Error/View");
                    }
                }
            }
            else
                return new RedirectResult(Url.Content("~") + BaseController.LOGINGUEST);
        }

        [ActionName("login"), HttpPost]
        public ActionResult Login2(FormCollection collection)
        {
            ClienteEntity item = Session[BaseController.USERSESSIONNAME] as ClienteEntity;
            if (item != null)
                return new RedirectResult(Url.Content("~") + BaseController.DEFAULTINDEX2);
            try
            {
                string tarjeta = Request.Form["txtTarjeta"];
                string idc = Request.Form["txtIDC"];
                string password = Request.Form["pwdPassword"];
                string url = Url.Content("~") + BaseController.DEFAULTINDEX;
                ClienteEntity cliente = new Service().Login(tarjeta, idc, password);
                Session[BaseController.USERSESSIONNAME] = cliente;
                if (cliente != null)
                    url = Url.Content("~") + BaseController.DEFAULTINDEX2;
                return new RedirectResult(url);
            }
            catch (Exception ex)
            {
                this.ViewBag.Message = ex.Message;
                return new RedirectResult(Url.Content("~") + BaseController.DEFAULTINDEX2);
            }
        }

        public ActionResult Logout()
        {
            Session.RemoveAll();
            Session.Abandon();
            return new RedirectResult(Url.Content("~") + BaseController.LOGINGUEST);
        }
    }
}