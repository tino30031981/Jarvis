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
                ClienteEntity item2 = new Service().Login(item.idCliente);
                Session[BaseController.USERSESSIONNAME] = item2;
                item = item2;
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
            ClienteEntity itemUser = Session[BaseController.USERSESSIONNAME] as ClienteEntity;
            ContribuyenteEntity item = Session[BaseController.USERSESSION2] as ContribuyenteEntity;
            TributoEntity item2 = item.tributos.Where(t => t.idTributo == Convert.ToString(id)).FirstOrDefault();
            ViewBag.Monto = item2.monto;
            ViewBag.Codigo = item2.idTributo;
            ViewBag.Titular = item.titular;
            List<SelectListItem> lst = new List<SelectListItem>();
            foreach (CuentaEntity cuenta in itemUser.cuentas)
            {
                lst.Add(new SelectListItem() { Text = cuenta.numeroCuenta, Value = cuenta.numeroCuenta });
            }
            ViewBag.Opciones = lst;
            return View();
        }

        [ActionName("pagar"), HttpPost]
        public ActionResult PagarTributo(FormCollection collection)
        {            
            try
            {
                ClienteEntity item = Session[BaseController.USERSESSIONNAME] as ClienteEntity;
                string url = Url.Content("~") + BaseController.DEFAULTINDEX;
                var ddl = Request.Form["Opcion"];
                TributoEntity tributo = new TributoEntity();
                tributo.idTributo = Request.Form["hdnIdTributo"];
                tributo.monto = Convert.ToDouble(Request.Form["txtMonto"]);
                tributo.estado = Request.Form["hdnEstado"];
                tributo.tipo = Request.Form["hdnTipo"];
                OperacionEntity operacion = new OperacionEntity();
                operacion.numeroCuentaRetiro = Request.Form["hdnTipo"];
                operacion.cliente = new ClienteEntity();
                operacion.cliente.idCliente = item.idCliente;
                operacion.monto = Convert.ToDouble(Request.Form["txtMonto"]);
                operacion.numeroCuentaRetiro = ddl;
                int value = new Service().Pagar(tributo, operacion);
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