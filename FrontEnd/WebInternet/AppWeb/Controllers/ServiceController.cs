using AppServices.Models;
using System.Collections.Generic;
using System.Web.Mvc;

namespace AppWeb.Controllers
{
    public class ServiceController : BaseController
    {
        // GET: Service
        public ActionResult Index()
        {
            ClienteEntity item = Session[BaseController.USERSESSIONNAME] as ClienteEntity;
            List<CuentaEntity> cuentas = item.cuentas;
            //if (cuentas[0] != null)
            CuentaEntity cuenta1 = cuentas[0] != null ? cuentas[0] : null;
            //if (cuentas[1] != null)
            CuentaEntity cuenta2 = cuentas[1] != null ? cuentas[1] : null;
            ViewBag.cuenta1 = cuenta1.numeroCuenta;
            ViewBag.cuenta2 = cuenta2.numeroCuenta;
            ViewBag.montocuenta1 = cuenta1.saldo;
            ViewBag.montocuenta2 = cuenta2.saldo;
            return View(cuentas);
        }

        public ActionResult Form()
        {
            return View();
        }

        [HttpPost]
        public JsonResult metodo()
        {
            ClienteEntity item = Session[BaseController.USERSESSIONNAME] as ClienteEntity;
            List<CuentaEntity> cuentas = item.cuentas;
            return Json(cuentas, JsonRequestBehavior.AllowGet);
        }
    }
}