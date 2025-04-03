
let controladorGra1;

function loadLogin() {
    fetch('Login/vistaLogin.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById("maincontent").innerHTML = html;

            const existingLink = document.querySelector('link[href="Login/cssindex.css"]');
            const existingLink2 = document.querySelector('link[href="modulos/css-modulos.css"]');

            if (existingLink) existingLink.remove();
            if (existingLink2) existingLink2.remove();

            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "Login/cssindex.css";
            document.head.appendChild(link);

            setTimeout(() => {
                import("../Login/Login.js").then(controller => {
                    controladorGra1 = controller;
                    console.log(controladorGra1);
                    
                    controladorGra1.verificarToken();
                }).catch(error => console.error("Error al importar Login.js:", error));
            }, 100);
        })
        .catch(error => console.error("Error al cargar la vista de login:", error));
}

function loadOnsite(){
    fetch('cliente/comedor.html')
            .then(response=>response.text())
            .then(html=>{
                document.getElementById("maincontent").innerHTML=html;
                import("../cliente/app.js").then(
                        function(controller){
                        });
                const existingLink = document.querySelector('link[href="inicio/css-inicio.css"]');
                if (existingLink) {
                    existingLink.remove();
                }
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href="modulos/css-modulos.css";
                document.head.appendChild(link);
            });
}

function loadInicio() {
    fetch('inicio/inicio.html')
            .then(response=>response.text())
            .then(html=>{
                document.getElementById("maincontent").innerHTML=html;
                const existingLink = document.querySelector('link[href="Login/cssindex.css"]');
                const existingLink2 = document.querySelector('link[href="modulos/css-modulos.css"]');
                if (existingLink) {
                    existingLink.remove();
                    
                }
                if (existingLink2) {
                    existingLink2.remove();
                    
                }
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = "inicio/css-inicio.css";
                document.head.appendChild(link);
            });
}

function cargarServicioEmpleado() {
    fetch('modulos/moduloEmpleado/vistaEmpleado.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById("maincontent").innerHTML = html;
            
            // Limpiar el script anterior si existe
            const oldScript = document.querySelector('script[src*="controladorEmpleado"]');
            if (oldScript) oldScript.remove();

            import("../modulos/moduloEmpleado/controladorEmpleado.js").then(controller => {
                controladorGra1 = controller;
                window.loadEmpleado = controller.loadEmpleado;
                window.loadEstados = controller.loadEstados;
                window.loadCiudades = controller.loadCiudades;
                window.SelectSucursales = controller.SelectSucursales;
                
                // Inicializar validaciones
                controller.inicializarValidaciones();
                
                // Cargar datos
                loadEmpleado();
                loadEstados();
                loadCiudades();
                loadSucursales();
            });

            const existingLink = document.querySelector('link[href="inicio/css-inicio.css"]');
            if (existingLink) {
                existingLink.remove();
            }
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href="modulos/css-modulos.css";
            document.head.appendChild(link);
        });
}

function cargarServicioSucursal() {
    fetch('modulos/moduloSucursal/vistaSucursal.html')
            .then(response=>response.text())
            .then(html=>{
                document.getElementById("maincontent").innerHTML=html;
                import("../modulos/moduloSucursal/controladorSucursal.js").then(
                        function(controller){
                            controladorGra1=controller;
                            controller.loadInitialData();
                        });
                const existingLink = document.querySelector('link[href="inicio/css-inicio.css"]');
                if (existingLink) {
                    existingLink.remove();
                }
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href="modulos/css-modulos.css";
                document.head.appendChild(link);
            });
}

function cargarServicioCliente() {
    fetch('modulos/moduloCliente/vistaCliente.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById("maincontent").innerHTML = html;
            
            // Limpiar el script anterior si existe
            const oldScript = document.querySelector('script[src*="controladorCliente"]');
            if (oldScript) oldScript.remove();

            import("../modulos/moduloCliente/controladorCliente.js").then(controller => {
                controladorGra1 = controller;
                window.loadCliente = controller.loadCliente;
                window.loadEstados = controller.loadEstados;
                window.loadCiudades = controller.loadCiudades;
                
                // Inicializar validaciones
                controller.inicializarValidaciones();
                
                // Cargar datos
                loadCliente();
                loadEstados();
                loadCiudades();
            });

            const existingLink = document.querySelector('link[href="inicio/css-inicio.css"]');
            if (existingLink) {
                existingLink.remove();
            }
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href="modulos/css-modulos.css";
            document.head.appendChild(link);
        });
}

function cargarServicioBebida() {
    fetch('modulos/moduloBebida/vistaBebida.html')
            .then(response=>response.text())
            .then(html=>{
                document.getElementById("maincontent").innerHTML=html;
                import("../modulos/moduloBebida/controladorBebida.js").then(
                        function(controller){
                            controladorGra1=controller;
                            window.loadBebida = controller.loadBebida;
                            window.loadCategoriaBd = controller.loadCategoriaBd;
                            loadCategoriaBd();
                            loadBebida();
                        });
                const existingLink = document.querySelector('link[href="inicio/css-inicio.css"]');
                if (existingLink) {
                    existingLink.remove();
                }
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href="modulos/css-modulos.css";
                document.head.appendChild(link);
            });
}

function cargarServicioAlimento() {
    fetch('modulos/moduloAlimento/vistaAlimento.html')
            .then(response=>response.text())
            .then(html=>{
                document.getElementById("maincontent").innerHTML=html;
                import("../modulos/moduloAlimento/controladorAlimento.js").then(
                        function(controller){
                            controladorGra1=controller;
                            window.loadAlimento = controller.loadAlimento;
                            window.loadCategoriaAlm = controller.loadCategoriaAlm;
                            loadAlimento();
                            loadCategoriaAlm();
                        });
                const existingLink = document.querySelector('link[href="inicio/css-inicio.css"]');
                if (existingLink) {
                    existingLink.remove();
                }
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href="modulos/css-modulos.css";
                document.head.appendChild(link);
            });
}

function mostrarMenu() {
    const toggleBtn = document.querySelector(".toggle_btn");
    console.log(toggleBtn);
    const toggleBtnIcon = document.querySelector("i");
    console.log(toggleBtnIcon);
    const dropDownMenu = document.querySelector(".menuDesplegable");        
    console.log(dropDownMenu);
    dropDownMenu.classList.toggle('open');
    const isOpen = dropDownMenu.classList.contains('open');
    if (isOpen) {
        toggleBtnIcon.classList.replace('fa-bars', 'fa-xmark');
    } else {
        toggleBtnIcon.classList.replace('fa-xmark', 'fa-bars');
    }
 
}