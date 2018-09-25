using AppServices.Models;
using AppServices.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace AppWeb.Controllers
{
    public class ServiceController : BaseController
    {
        // GET: Service
        public ActionResult Index()
        {
            ClienteEntity item = Session[BaseController.USERSESSIONNAME] as ClienteEntity;
            if (item != null)
            {
                List<CuentaEntity> cuentas = item.cuentas;
                CuentaEntity cuenta1 = cuentas[0] != null ? cuentas[0] : null;
                CuentaEntity cuenta2 = cuentas[1] != null ? cuentas[1] : null;
                ViewBag.cuenta1 = cuenta1.numeroCuenta;
                ViewBag.cuenta2 = cuenta2.numeroCuenta;
                ViewBag.montocuenta1 = cuenta1.saldo;
                ViewBag.montocuenta2 = cuenta2.saldo;
            }
            return View();
        }

        [HttpGet]
        public ActionResult Form(int id)
        {
            ContribuyenteEntity item = Session[BaseController.USERSESSION2] as ContribuyenteEntity;
            TributoEntity item2 = item.tributos.Where(t => t.idTributo == Convert.ToString(id)).FirstOrDefault();
            ViewBag.Monto = item2.monto;
            ViewBag.Codigo = item2.idTributo;
            ViewBag.Titular = item.titular;            
            return View();
        }

        [ActionName("pagar"), HttpPost]
        public ActionResult PagarTributo(FormCollection collection)
        {            
            try
            {
                string url = Url.Content("~") + BaseController.DEFAULTINDEX;
                TributoEntity tributo = new TributoEntity();
                tributo.idTributo = Request.Form["hdnIdTributo"];
                tributo.monto = Convert.ToDouble(Request.Form["txtMonto"]);
                tributo.estado = Request.Form["hdnEstado"];
                tributo.tipo = Request.Form["hdnTipo"];
                int value = new Service().Pagar(tributo);
                if (value != 0)
                    url = Url.Content("~") + BaseController.DEFAULTINDEX2;
                return new RedirectResult(url);
            }
            catch (Exception ex)
            {
                this.ViewBag.Message = ex.Message;
                return new RedirectResult(Url.Content("~") + BaseController.DEFAULTINDEX2);
            }
        }

        [HttpPost]
        public JsonResult Consultartributo(string buscar)
        {
            ContribuyenteEntity contribuyente = new Service().ConsultaTributos(buscar);
            Session[BaseController.USERSESSION2] = contribuyente;
            if (contribuyente == null)
                return Json("");
            else
                return Json(contribuyente.tributos, JsonRequestBehavior.AllowGet);
        }
    }
}