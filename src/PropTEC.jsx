import { useState, useRef } from "react";
import bgRepublica from "./assets/republica.webp";
import imgR1 from "./assets/R1.avif";
import imgR2 from "./assets/R2.avif";
import imgI1 from "./assets/I1.avif";
import imgI2 from "./assets/I2.avif";
import imgP1 from "./assets/P1.avif";
import imgP2 from "./assets/P2.avif";
import imgMapa from "./assets/mapa.png";
import { MapPin } from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";

/* ─── THEME ─────────────────────────────────────────────────── */
const C = {
  navy:   "#1B3764",
  green:  "#52C41A",
  greenB: "#6FCF42",
  red:    "#E53E3E",
  salmon: "#F28B82",
  lav:    "#7986CB",
  bg:     "#F0F2F5",
  muted:  "#718096",
};

/* ─── DATA ───────────────────────────────────────────────────── */
const INIT_PROPS = [
  { id:1, name:"Apartamento en la Carolina", group:"República",  price:35, rooms:2, on:true,  img:imgR1 },
  { id:2, name:"Suite Ejecutiva República",  group:"República",  price:48, rooms:1, on:true,  img:imgR2 },
  { id:3, name:"Estudio Oxford",             group:"Inglaterra", price:38, rooms:1, on:true,  img:imgI1 },
  { id:4, name:"Loft Naciones Unidas",       group:"Inglaterra", price:52, rooms:2, on:false, img:imgI2 },
  { id:5, name:"Jardín Pradera Sur",         group:"Pradera",    price:30, rooms:1, on:true,  img:imgP1 },
  { id:6, name:"Piso Alto Pradera",          group:"Pradera",    price:44, rooms:2, on:true,  img:imgP2 },
];

const REVENUE = [
  {m:"Ene",v:2800},{m:"Feb",v:3200},{m:"Mar",v:2900},
  {m:"Abr",v:3800},{m:"May",v:4100},{m:"Jun",v:3600},{m:"Jul",v:4400},
];
const OCUP = [
  {m:"May",r:68,p:70},{m:"Jun",r:74,p:72},{m:"Jul",r:76,p:75},
  {m:"Ago",r:null,p:78},{m:"Sep",r:null,p:80},{m:"Oct",r:null,p:82},
];
const RESERVAS = [
  {id:"RES-001",propId:1,prop:"Apto Carolina",  quien:"María García", entrada:"2026-07-15",salida:"2026-07-18",canal:"Directo", estado:"Confirmada",monto:105},
  {id:"RES-002",propId:2,prop:"Suite Norte",    quien:"Carlos Vega",  entrada:"2026-07-20",salida:"2026-07-25",canal:"Airbnb",  estado:"Pendiente", monto:225},
  {id:"RES-003",propId:3,prop:"Piso Iñaquito",  quien:"Ana Torres",   entrada:"2026-07-22",salida:"2026-07-24",canal:"Booking", estado:"Confirmada",monto:110},
  {id:"RES-004",propId:4,prop:"Loft Mariscal",  quien:"Pedro Lema",   entrada:"2026-08-01",salida:"2026-08-05",canal:"Directo", estado:"Confirmada",monto:120},
];
const PAGOS = [
  {id:"PAG-001",res:"RES-001",quien:"María García",monto:105,fecha:"2026-07-14",met:"Kushki",       estado:"Completado"},
  {id:"PAG-002",res:"RES-003",quien:"Ana Torres",  monto:110,fecha:"2026-07-21",met:"Tarjeta",      estado:"Completado"},
  {id:"PAG-003",res:"RES-004",quien:"Pedro Lema",  monto:120,fecha:"2026-07-31",met:"Transferencia",estado:"Pendiente"},
  {id:"PAG-004",res:"RES-002",quien:"Carlos Vega", monto:225,fecha:"2026-07-19",met:"Kushki",       estado:"Pendiente"},
];
const ML = [
  {prop:"Apto Carolina",   act:35,sug:42,dem:"Alta", t:"↑"},
  {prop:"Suite Norte",     act:45,sug:45,dem:"Media",t:"→"},
  {prop:"Loft Mariscal",   act:30,sug:28,dem:"Baja", t:"↓"},
  {prop:"Piso Iñaquito",   act:55,sug:62,dem:"Alta", t:"↑"},
  {prop:"Estudio Pradera", act:28,sug:32,dem:"Alta", t:"↑"},
];
const T_PROPS = [
  { id:1, name:"Apartamento en la Carolina", addr:"Av. República 234",       rooms:2, price:35, img:imgR1, group:"República"  },
  { id:2, name:"Suite Ejecutiva República",  addr:"Av. República 456",       rooms:1, price:48, img:imgR2, group:"República"  },
  { id:3, name:"Estudio Oxford",             addr:"Calle Inglaterra 789",    rooms:1, price:38, img:imgI1, group:"Inglaterra" },
  { id:4, name:"Loft Naciones Unidas",       addr:"Av. Naciones Unidas 123", rooms:2, price:52, img:imgI2, group:"Inglaterra" },
  { id:5, name:"Jardín Pradera Sur",         addr:"Calle Pradera Sur 45",    rooms:1, price:30, img:imgP1, group:"Pradera"    },
  { id:6, name:"Piso Alto Pradera",          addr:"Av. La Pradera 78",       rooms:2, price:44, img:imgP2, group:"Pradera"    },
];
const NOTIFS = [
  {id:1,t:"Nueva reserva: María García",      s:"Apto Carolina · hace 5 min",r:false},
  {id:2,t:"Pago recibido: $105 – RES-001",   s:"hace 1 hora",                r:false},
  {id:3,t:"ML: precio sugerido actualizado", s:"hace 3 horas",               r:true},
];
const MIS_RESERVAS = [
  {id:"RES-005",prop:"Apartamento en la Carolina",entrada:"2026-07-20",salida:"2026-07-23",canal:"Directo",estado:"Confirmada",monto:108},
  {id:"RES-006",prop:"Suite Ejecutiva República",  entrada:"2026-08-05",salida:"2026-08-07",canal:"Directo",estado:"Pendiente", monto:99},
]

/* ─── UTILS ──────────────────────────────────────────────────── */
function Gauge({ value, max = 100 }) {
  const cx = 100, cy = 88, r = 75, pct = Math.min(value / max, 1);
  const a  = (1 - pct) * Math.PI;
  const vx = cx + r * Math.cos(a),  vy = cy - r * Math.sin(a);
  const nx = cx + (r-18)*Math.cos(a), ny = cy - (r-18)*Math.sin(a);
  return (
    <svg viewBox="0 0 200 120" style={{ width:"100%", maxWidth:220 }}>
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
        fill="none" stroke="#E2E8F0" strokeWidth="13" strokeLinecap="round"/>
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${vx} ${vy}`}
        fill="none" stroke={C.lav} strokeWidth="13" strokeLinecap="round"/>
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#4A5568" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r="5" fill="#4A5568"/>
      <text x={cx-r-4} y={cy+22} fontSize="8" fill={C.muted} textAnchor="middle">0</text>
      <text x={cx+r+4} y={cy+22} fontSize="8" fill={C.muted} textAnchor="middle">100</text>
      <text x={cx} y={cy+28} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1A202C">{value}%</text>
    </svg>
  );
}

function Badge({ text }) {
  const map = {
    Confirmada:{bg:"#F0FFF4",tc:"#22543D"},Pendiente:{bg:"#FFFBEB",tc:"#744210"},
    Cancelada:{bg:"#FFF5F5",tc:"#742A2A"},Completado:{bg:"#EBF8FF",tc:"#2A4365"},
    Alta:{bg:"#FFF5F5",tc:"#C53030"},Media:{bg:"#FFFBEB",tc:"#744210"},Baja:{bg:"#F0FFF4",tc:"#22543D"},
  };
  const s = map[text] || { bg:"#EDF2F7", tc:"#4A5568" };
  return (
    <span style={{background:s.bg,color:s.tc,padding:"2px 8px",borderRadius:12,fontSize:11,fontWeight:600}}>
      {text}
    </span>
  );
}

function Toggle({ on, onChange }) {
  return (
    <div onClick={onChange} style={{width:38,height:20,borderRadius:10,background:on?C.green:"#CBD5E0",cursor:"pointer",position:"relative",transition:"background .2s"}}>
      <div style={{width:16,height:16,borderRadius:"50%",background:"white",position:"absolute",top:2,left:on?20:2,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
    </div>
  );
}

const inp = (extra={}) => ({
  width:"100%",padding:"8px 10px",border:"1px solid #CBD5E0",borderRadius:7,
  fontSize:12,boxSizing:"border-box",...extra
});
const lbl = { fontSize:11,fontWeight:600,color:"#4A5568",display:"block",marginBottom:3 };
const card = { background:"white",borderRadius:10,padding:18,boxShadow:"0 1px 4px rgba(0,0,0,.06)" };
const th = { padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,borderBottom:"1px solid #E2E8F0" };
const td = (i) => ({ padding:"10px 14px",background:i%2?"#FAFBFC":"white",borderBottom:"1px solid #F7FAFC" });

/* ─── MAIN ───────────────────────────────────────────────────── */
export default function PropTEC() {
  const [page,       setPage]       = useState("login");
  const [manTab,     setManTab]     = useState("dashboard");
  const [tenTab,     setTenTab]     = useState("buscar");
  const [props,      setProps]      = useState(INIT_PROPS);
  const [showExport, setShowExport] = useState(false);
  const [showNotif,  setShowNotif]  = useState(false);
  const [showModal,  setShowModal]  = useState(false);
  const [selProp,    setSelProp]    = useState(null);
  const [resvDone,   setResvDone]   = useState(false);
  const [loginRole,  setLoginRole]  = useState("gestor");
  const [newProp,    setNewProp]    = useState({name:"",group:"",price:"",rooms:"",amenities:[]});
  const [resvForm,   setResvForm]   = useState({entrada:"", salida:""});
  const [grupoFiltro, setGrupoFiltro] = useState(null);
  const [regData,    setRegData]    = useState({tipo:"",nombre:"",apellido:"",email:"",pwd:"",pwd2:"",t1:false,t2:false});
  const [filtroEstado, setFiltroEstado] = useState("Todos los estados");
  const [mlDecisions, setMlDecisions] = useState({})
  const [reservas, setReservas] = useState(RESERVAS);
  const [calProp, setCalProp] = useState(1);
  const [bloqueos, setBloqueos] = useState([
    {propId:1, fecha:"2026-07-15"}, {propId:1, fecha:"2026-07-16"},
    {propId:1, fecha:"2026-07-17"}, {propId:2, fecha:"2026-07-20"},
  ]);
  const [showBloqueo, setShowBloqueo] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [showFiltros, setShowFiltros] = useState(false);
  const [precioMax, setPrecioMax] = useState(100);

  const toggleProp = (id) => setProps(ps => ps.map(p => p.id===id ? {...p,on:!p.on} : p));
  const nights = () => resvForm.entrada&&resvForm.salida
    ? Math.max(1, Math.round((new Date(resvForm.salida)-new Date(resvForm.entrada))/86400000)) : 1;
  const navTo = (tab) => { setManTab(tab); setShowExport(false); setShowNotif(false); };
  const mapRef  = useRef(null);
  const dragRef = useRef({dragging:false,startX:0,startY:0,scrollLeft:0,scrollTop:0});
  const onMapDown = e => { const m=mapRef.current; dragRef.current={dragging:true,startX:e.clientX,startY:e.clientY,scrollLeft:m.scrollLeft,scrollTop:m.scrollTop}; m.style.cursor="grabbing"; };
  const onMapMove = e => { const d=dragRef.current; if(!d.dragging) return; e.preventDefault(); const m=mapRef.current; m.scrollLeft=d.scrollLeft-(e.clientX-d.startX); m.scrollTop=d.scrollTop-(e.clientY-d.startY); };
  const onMapUp   = () => { dragRef.current.dragging=false; if(mapRef.current) mapRef.current.style.cursor="grab"; };
  const [filtroPropiedad, setFiltroPropiedad] = useState("Todas");
  const [filtroPeriodo, setFiltroPeriodo] = useState("2026-07");

  /* ── shared header ── */
  const Header = ({ title, tenant=false }) => (
    <div style={{background:"white",height:54,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",borderBottom:"1px solid #E2E8F0",flexShrink:0,zIndex:10}}>
      <div style={{fontWeight:900,fontSize:17,letterSpacing:"-0.5px"}}>
        Prop<span style={{fontWeight:900}}>TEC</span>
      </div>
      {tenant ? (
        <div style={{display:"flex",gap:4}}>
          {[["buscar","Buscar"],["mis-res","Mis reservas"],["mi-cuenta","Mi cuenta"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTenTab(k)}
              style={{padding:"4px 12px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
                background:tenTab===k?C.green:"transparent",color:tenTab===k?"white":"#4A5568"}}>
              {l}
            </button>
          ))}
        </div>
      ) : (
        <div style={{fontWeight:700,fontSize:14}}>{title}</div>
      )}
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        {!tenant && (
          <div style={{position:"relative"}}>
            <button onClick={()=>{setShowNotif(!showNotif);setShowExport(false);}}
              style={{background:"none",border:"none",cursor:"pointer",fontSize:17,position:"relative",padding:0}}>
              🔔
              <span style={{position:"absolute",top:-4,right:-4,background:C.red,color:"white",borderRadius:"50%",width:15,height:15,fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>
                {NOTIFS.filter(n=>!n.r).length}
              </span>
            </button>
            {showNotif && (
              <div style={{position:"absolute",right:0,top:"110%",background:"white",borderRadius:8,boxShadow:"0 8px 24px rgba(0,0,0,.13)",width:270,zIndex:200}}>
                <div style={{padding:"10px 14px",borderBottom:"1px solid #E2E8F0",fontWeight:700,fontSize:12}}>Notificaciones</div>
                {NOTIFS.map(n=>(
                  <div key={n.id} style={{padding:"9px 14px",borderBottom:"1px solid #F7FAFC",background:n.r?"white":"#EBF8FF"}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#2D3748"}}>{n.t}</div>
                    <div style={{fontSize:10,color:C.muted,marginTop:1}}>{n.s}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div style={{width:30,height:30,borderRadius:"50%",background:C.navy,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700}}>JR</div>
      </div>
    </div>
  );

  /* ── sidebar ── */
  const Sidebar = () => (
    <div style={{background:C.navy,width:118,display:"flex",flexDirection:"column",flexShrink:0}}>
      <div style={{padding:"16px 12px 10px",color:"white",fontWeight:900,fontSize:15,letterSpacing:"-0.5px"}}>
        Prop<span>TEC</span>
      </div>
      <div style={{flex:1}}>
        {[["dashboard","⊞","Dashboard"],["props","🏠","Propiedades"],["reservas","📅","Reservas"],["pagos","💳","Pagos"],["intel","🤖","Inteligencia\nOperativa"]].map(([id,ic,lb])=>(
          <button key={id} onClick={()=>navTo(id)}
            style={{width:"100%",padding:"9px 10px",textAlign:"left",border:"none",cursor:"pointer",
              background:manTab===id?C.green:"transparent",color:"white",
              display:"flex",flexDirection:"column",gap:1,marginBottom:1,fontSize:10,fontWeight:manTab===id?700:400}}>
            <span style={{fontSize:14}}>{ic}</span>
            <span style={{whiteSpace:"pre-wrap",lineHeight:1.3}}>{lb}</span>
          </button>
        ))}
      </div>
      <div style={{padding:"10px 10px 14px"}}>
        <button onClick={()=>setPage("login")}
          style={{width:"100%",padding:"7px 10px",background:C.red,color:"white",border:"none",borderRadius:6,cursor:"pointer",fontSize:10,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
          ⏻ Cerrar sesión
        </button>
      </div>
    </div>
  );

  /* ════════════ LOGIN ════════════ */
  if (page==="login") return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg,fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"white",borderRadius:14,boxShadow:"0 6px 28px rgba(0,0,0,.10)",display:"flex",overflow:"hidden",width:"min(760px,94vw)",minHeight:460}}>
        {/* Left */}
        <div style={{flex:1,background:`linear-gradient(145deg,rgba(27,55,100,0.82) 0%,rgba(45,106,79,0.82) 100%), url(${bgRepublica}) center/cover no-repeat`,padding:38,display:"flex",flexDirection:"column",justifyContent:"center",color:"white"}}>
          <div style={{fontSize:26,fontWeight:900,marginBottom:14,letterSpacing:"-1px"}}>Prop<span style={{color:C.greenB}}>TEC</span></div>
          <div style={{fontSize:17,fontWeight:700,marginBottom:14}}>Plataforma tipo PMS</div>
          <div style={{fontSize:12,lineHeight:1.85,color:"rgba(255,255,255,.85)"}}>
            <strong>Gestor:</strong> gestiona portafolio, sincroniza reservas,{" "}
            <strong style={{color:C.greenB}}>predice precios</strong> y recibe alertas inteligentes.<br/><br/>
            <strong>Arrendatario:</strong> busca, reserva y{" "}
            <strong style={{color:C.greenB}}>predice el mejor precio</strong>.
          </div>
          <button style={{marginTop:22,padding:"8px 18px",background:C.greenB,color:"white",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer",fontSize:13,width:"fit-content"}}>
            Aprende más
          </button>
        </div>
        {/* Right */}
        <div style={{flex:1,padding:38,display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <div style={{fontSize:19,fontWeight:800,marginBottom:2}}>Bienvenido a <strong>PropTEC</strong></div>
          <div style={{color:C.muted,fontSize:12,marginBottom:22}}>Inicia sesión para continuar</div>

          <label style={lbl}>Tipo de usuario</label>
          <select value={loginRole} onChange={e=>setLoginRole(e.target.value)} style={{...inp(),marginBottom:13}}>
            <option value="gestor">Gestor</option>
            <option value="arrendatario">Arrendatario</option>
          </select>

          <label style={lbl}>Correo electrónico</label>
          <input placeholder="correo@ejemplo.com" style={{...inp(),marginBottom:13}}/>

          <label style={lbl}>Contraseña</label>
          <input type="password" placeholder="••••••••" style={{...inp(),marginBottom:22}}/>

          <button onClick={()=>setPage(loginRole==="gestor"?"manager":"tenant")}
            style={{width:"100%",padding:"11px",background:C.greenB,color:"white",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer",fontSize:14,marginBottom:10}}>
            Iniciar Sesión
          </button>
          <div style={{textAlign:"center",fontSize:12,color:C.muted}}>
            ¿No tienes cuenta?{" "}
            <button onClick={()=>setPage("register")} style={{background:"none",border:"none",color:C.lav,fontWeight:600,cursor:"pointer",fontSize:12}}>
              Regístrate
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ════════════ REGISTER ════════════ */
  if (page==="register") return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg,fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"white",borderRadius:14,boxShadow:"0 6px 28px rgba(0,0,0,.10)",display:"flex",overflow:"hidden",width:"min(760px,94vw)"}}>
        {/* Left */}
        <div style={{flex:1,background:`linear-gradient(145deg,rgba(27,55,100,0.82) 0%,rgba(45,106,79,0.82) 100%), url(${bgRepublica}) center/cover no-repeat`,padding:38,display:"flex",flexDirection:"column",justifyContent:"center",color:"white"}}>
          <div style={{fontSize:26,fontWeight:900,marginBottom:14,letterSpacing:"-1px"}}>Prop<span style={{color:C.greenB}}>TEC</span></div>
          <div style={{fontSize:17,fontWeight:700,marginBottom:14}}>Plataforma tipo PMS</div>
          <div style={{fontSize:12,lineHeight:1.85,color:"rgba(255,255,255,.85)"}}>
            <strong>Gestor:</strong> gestiona portafolio, sincroniza reservas,{" "}
            <strong style={{color:C.greenB}}>predice precios</strong> y recibe alertas inteligentes.<br/><br/>
            <strong>Arrendatario:</strong> busca, reserva y{" "}
            <strong style={{color:C.greenB}}>predice el mejor precio</strong>.
          </div>
        </div>
        {/* Right */}
        <div style={{flex:1,padding:38,overflowY:"auto"}}>
          <div style={{fontSize:19,fontWeight:800,marginBottom:2}}>Bienvenido a <strong>PropTEC</strong></div>
          <div style={{color:C.muted,fontSize:12,marginBottom:16}}>¡Regístrate!</div>

          <select value={regData.tipo} onChange={e=>setRegData({...regData,tipo:e.target.value})} style={{...inp(),marginBottom:13}}>
            <option value="">Tipo de usuario</option>
            <option value="gestor">Gestor</option>
            <option value="arrendatario">Arrendatario</option>
          </select>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            {[["nombre","Nombre"],["apellido","Apellido"]].map(([k,l])=>(
              <div key={k}><label style={lbl}>{l}</label>
                <input value={regData[k]} onChange={e=>setRegData({...regData,[k]:e.target.value})} style={inp()}/>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div><label style={lbl}>Dirección e-mail</label>
              <input value={regData.email} onChange={e=>setRegData({...regData,email:e.target.value})} style={inp()}/>
            </div>
            <div><label style={lbl}>Contraseña</label>
              <input type="password" value={regData.pwd} onChange={e=>setRegData({...regData,pwd:e.target.value})} style={inp()}/>
            </div>
          </div>
          <label style={lbl}>Confirmar contraseña</label>
          <input type="password" value={regData.pwd2} onChange={e=>setRegData({...regData,pwd2:e.target.value})} style={{...inp(),marginBottom:13}}/>

          {[["t1","Acepto el Acuerdo de Protección de Datos Personales"],["t2","He leído las Condiciones de uso y Política de privacidad"]].map(([k,l])=>(
            <label key={k} style={{display:"flex",alignItems:"flex-start",gap:7,fontSize:11,color:"#4A5568",marginBottom:8,cursor:"pointer"}}>
              <input type="checkbox" checked={regData[k]} onChange={e=>setRegData({...regData,[k]:e.target.checked})} style={{marginTop:2}}/>
              <span style={{color:C.lav,fontWeight:600}}>{l}</span>
            </label>
          ))}

          <button onClick={()=>setPage("login")}
            style={{width:"100%",padding:"11px",background:C.greenB,color:"white",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer",fontSize:14,margin:"10px 0 8px"}}>
            Crear Cuenta
          </button>
          <div style={{textAlign:"center",fontSize:12,color:C.muted}}>
            ¿Ya tienes cuenta?{" "}
            <button onClick={()=>setPage("login")} style={{background:"none",border:"none",color:C.lav,fontWeight:600,cursor:"pointer",fontSize:12}}>
              Inicia Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ════════════ MANAGER ════════════ */
  if (page==="manager") return (
    <div style={{display:"flex",height:"100vh",background:C.bg,fontFamily:"system-ui,sans-serif",fontSize:13}} onClick={()=>showExport&&setShowExport(false)}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <Header title={{dashboard:"Dashboard",props:"Propiedades",reservas:"Reservas",pagos:"Pagos",intel:"Inteligencia Operativa"}[manTab]}/>
        <div style={{flex:1,overflowY:"auto"}}>

          {/* ── DASHBOARD ── */}
          {manTab==="dashboard" && (
            <div style={{padding:20}}>
              {/* Filtros */}
              <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
                <div style={{fontSize:11,fontWeight:600,color:C.muted}}>Filtrar por:</div>
                <select value={filtroPropiedad} onChange={e=>setFiltroPropiedad(e.target.value)}
                  style={{padding:"5px 10px",border:"1px solid #CBD5E0",borderRadius:6,fontSize:11}}>
                  <option value="Todas">Todas las propiedades</option>
                  {INIT_PROPS.map(p=>(
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
                <input type="month" value={filtroPeriodo} onChange={e=>setFiltroPeriodo(e.target.value)}
                  style={{padding:"5px 10px",border:"1px solid #CBD5E0",borderRadius:6,fontSize:11}}/>
                <button onClick={()=>{setFiltroPropiedad("Todas");setFiltroPeriodo("2026-07");}}
                  style={{padding:"5px 10px",background:"none",border:"1px solid #CBD5E0",borderRadius:6,fontSize:11,cursor:"pointer",color:C.muted}}>
                  Limpiar filtros
                </button>
              </div>
              {/* KPIs */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18}}>
                {[
                  {l:"Propiedades activas", v:`${props.filter(p=>p.on).length}`, s:`de ${props.length} totales`, ic:"🏠", bg:"#EBF8FF"},
                  {l:"Ingresos del mes",    v:"$4,400",s:"↑ 22% vs jun",ic:"💰",bg:"#FFFBEB"},
                  {l:"Reservas activas", v:`${RESERVAS.length}`, s:`${RESERVAS.filter(r=>r.estado==="Pendiente").length} pendientes`, ic:"📅", bg:"#FFF5F5"},
                ].map((k,i)=>(
                  <div key={i} style={{...card,padding:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div style={{fontSize:10,color:C.muted,fontWeight:600,marginBottom:3}}>{k.l}</div>
                        <div style={{fontSize:20,fontWeight:800}}>{k.v}</div>
                        <div style={{fontSize:10,color:C.muted,marginTop:2}}>{k.s}</div>
                      </div>
                      <div style={{background:k.bg,borderRadius:7,padding:7,fontSize:18}}>{k.ic}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Charts row */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                {/* Canal pie */}
                <div style={card}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div style={{fontWeight:700,fontSize:13}}>Canal Directo vs OTA</div>
                    <div style={{position:"relative"}}>
                      <button onClick={e=>{e.stopPropagation();setShowExport(!showExport);setShowNotif(false);}}
                        style={{padding:"5px 12px",background:"#DAFFD0",color:"#276749",border:"none",borderRadius:6,fontWeight:600,fontSize:11,cursor:"pointer"}}>
                        Exportar datos ▾
                      </button>
                      {showExport && (
                        <div style={{position:"absolute",right:0,top:"110%",background:"white",borderRadius:8,boxShadow:"0 4px 16px rgba(0,0,0,.12)",zIndex:100,minWidth:110}} onClick={e=>e.stopPropagation()}>
                          {["PDF","CSV"].map(f=>(
                            <button key={f} onClick={()=>setShowExport(false)}
                              style={{display:"block",width:"100%",padding:"9px 14px",textAlign:"left",border:"none",background:"none",cursor:"pointer",fontSize:12,color:"#2D3748"}}>
                              {f}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={175}>
                    <PieChart>
                      <Pie
                        data={[
                          { name:"OTA",     value: RESERVAS.filter(r=>r.canal!=="Directo").length },
                          { name:"Directo", value: RESERVAS.filter(r=>r.canal==="Directo").length },
                        ]}
                        cx="50%" cy="50%" outerRadius={70} dataKey="value"
                        label={false} labelLine={false}>
                        <Cell fill={C.salmon}/><Cell fill={C.lav}/>
                      </Pie>
                      <Tooltip formatter={v=>`${v} reservas`}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:8,flexWrap:"wrap"}}>
                    {[["OTA",C.salmon,RESERVAS.filter(r=>r.canal!=="Directo").length],["Directo",C.lav,RESERVAS.filter(r=>r.canal==="Directo").length]].map(([l,col,v])=>(
                      <div key={l} style={{display:"flex",alignItems:"center",gap:6,fontSize:12}}>
                        <div style={{width:10,height:10,borderRadius:2,background:col}}/>
                        <span style={{color:C.muted}}>{l}:</span>
                        <span style={{fontWeight:700}}>{v} reservas</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Gauge */}
                <div style={{...card,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <div style={{fontWeight:700,fontSize:13,alignSelf:"flex-start",marginBottom:4}}>Ocupación promedio</div>
                  <Gauge value={76}/>
                  <div style={{fontSize:11,color:"#276749",fontWeight:600,marginTop:4}}>↑ 4% vs mes anterior</div>
                </div>
              </div>
              {/* Revenue */}
              <div style={card}>
                <div style={{fontWeight:700,fontSize:13,marginBottom:12}}>Ingresos mensuales (USD)</div>
                <ResponsiveContainer width="100%" height={155}>
                  <AreaChart data={REVENUE}>
                    <defs>
                      <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.lav} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={C.lav} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F7FAFC"/>
                    <XAxis dataKey="m" tick={{fontSize:10}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/>
                    <Tooltip formatter={v=>[`$${v}`,"Ingresos"]}/>
                    <Area type="monotone" dataKey="v" stroke={C.lav} fill="url(#rg)" strokeWidth={2}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ── PROPIEDADES ── */}
          {manTab==="props" && (
            <div style={{padding:20}}>
              {/* Modal */}
              {showModal && (
                <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300}}>
                  <div style={{background:"white",borderRadius:12,padding:28,width:"min(500px,90vw)",maxHeight:"90vh",overflowY:"auto"}}>
                    <div style={{fontWeight:800,fontSize:15,marginBottom:16}}>Registrar propiedad</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                      <div>
                        <label style={lbl}>Nombre</label>
                        <input value={newProp.name} onChange={e=>setNewProp({...newProp,name:e.target.value})} placeholder="Ej: Apto La Carolina" style={inp()}/>
                      </div>
                      <div>
                        <label style={lbl}>Seleccione un grupo</label>
                        <select value={newProp.group} onChange={e=>setNewProp({...newProp,group:e.target.value})} style={inp()}>
                          <option value="">Seleccionar...</option>
                          <option>República</option><option>Norte</option><option>Centro</option>
                        </select>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                      <div>
                        <label style={lbl}>Precio por noche (USD)</label>
                        <input type="number" value={newProp.price} onChange={e=>setNewProp({...newProp,price:e.target.value})} placeholder="35" style={inp()}/>
                      </div>
                      <div>
                        <label style={lbl}>Nº de habitaciones</label>
                        <input type="number" value={newProp.rooms} onChange={e=>setNewProp({...newProp,rooms:e.target.value})} placeholder="2" style={inp()}/>
                      </div>
                    </div>
                    <div style={{marginBottom:12}}>
                      <label style={{...lbl,marginBottom:7}}>Servicios incluidos</label>
                      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                        {["WiFi","Agua caliente","Parqueadero","Cocina"].map(s=>(
                          <label key={s} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,cursor:"pointer"}}>
                            <input type="checkbox"
                              checked={newProp.amenities.includes(s)}
                              onChange={e=>{
                                const a=e.target.checked?[...newProp.amenities,s]:newProp.amenities.filter(x=>x!==s);
                                setNewProp({...newProp,amenities:a});
                              }}/>
                            {s}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div style={{marginBottom:18}}>
                      <label style={{...lbl,marginBottom:7}}>Fotografías</label>
                      <div style={{border:"2px dashed #CBD5E0",borderRadius:8,padding:20,textAlign:"center",color:C.muted,fontSize:12,cursor:"pointer"}}>
                        📷 Arrastra o haz clic para subir fotos
                      </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
                      <button onClick={()=>setShowModal(false)} style={{padding:"7px 18px",background:"none",border:"none",color:C.lav,fontWeight:600,cursor:"pointer",fontSize:13}}>Cancelar</button>
                      <button onClick={()=>{
                        if(newProp.name&&newProp.price){
                          setProps(ps=>[...ps,{id:Date.now(),...newProp,price:+newProp.price,rooms:+newProp.rooms||1,on:false}]);
                          setNewProp({name:"",group:"",price:"",rooms:"",amenities:[]});
                          setShowModal(false);
                        }
                      }} style={{padding:"7px 18px",background:C.greenB,color:"white",border:"none",borderRadius:7,fontWeight:700,cursor:"pointer",fontSize:13}}>
                        Guardar propiedad
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <button onClick={()=>setShowModal(true)}
                style={{padding:"7px 16px",background:C.greenB,color:"white",border:"none",borderRadius:7,fontWeight:700,cursor:"pointer",marginBottom:16,fontSize:12}}>
                + Registrar propiedad
              </button>
              <div style={{...card,padding:0,overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{background:"#F7FAFC"}}>
                      {["Fotografía","Nombre","Grupo","Precio/noche","Habitaciones","Estado",""].map(h=>(
                        <th key={h} style={th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {props.map((p,i)=>(
                      <tr key={p.id}>
                        <td style={td(i)}>
                          <img src={p.img} alt={p.name} style={{width:52,height:38,borderRadius:5,objectFit:"cover",display:"block"}}/>
                        </td>
                        <td style={{...td(i),fontWeight:600,color:"#2D3748"}}>{p.name}</td>
                        <td style={{...td(i),color:C.muted}}>{p.group}</td>
                        <td style={{...td(i),fontWeight:600}}>${p.price} USD</td>
                        <td style={{...td(i),color:C.muted}}>{p.rooms} hab.</td>
                        <td style={td(i)}><Toggle on={p.on} onChange={()=>toggleProp(p.id)}/></td>
                        <td style={td(i)}><button style={{background:"none",border:"none",cursor:"pointer",fontSize:14}}>✏️</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── RESERVAS ── */}
          {manTab==="reservas" && (
            <div style={{padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div>
                  <div style={{fontWeight:800,fontSize:15}}>Reservas</div>
                  <div style={{fontSize:11,color:C.muted}}>Gestiona las reservas de tus propiedades</div>
                </div>
                <select value={filtroEstado} onChange={e=>setFiltroEstado(e.target.value)}
                  style={{padding:"5px 10px",border:"1px solid #CBD5E0",borderRadius:6,fontSize:11}}>
                  <option>Todos los estados</option><option>Confirmada</option><option>Pendiente</option><option>Cancelada</option>
                </select>
              </div>
              <div style={{...card,padding:0,overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{background:"#F7FAFC"}}>
                      {["ID","Propiedad","Inquilino","Entrada","Salida","Canal","Estado","Monto","Acciones"].map(h=>(
                        <th key={h} style={th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.filter(r=>filtroEstado==="Todos los estados"||r.estado===filtroEstado).map((r,i)=>(
                      <tr key={r.id}>
                        <td style={{...td(i),color:C.lav,fontWeight:600,fontSize:11}}>{r.id}</td>
                        <td style={{...td(i),fontWeight:600,color:"#2D3748",fontSize:12}}>{r.prop}</td>
                        <td style={{...td(i),color:"#4A5568",fontSize:12}}>{r.quien}</td>
                        <td style={{...td(i),color:C.muted,fontSize:11}}>{r.entrada}</td>
                        <td style={{...td(i),color:C.muted,fontSize:11}}>{r.salida}</td>
                        <td style={td(i)}><span style={{background:"#EDF2F7",color:"#4A5568",padding:"1px 7px",borderRadius:9,fontSize:10,fontWeight:600}}>{r.canal}</span></td>
                        <td style={td(i)}><Badge text={r.estado}/></td>
                        <td style={{...td(i),fontWeight:700}}>${r.monto}</td>
                        <td style={td(i)}>
                          {r.estado==="Pendiente" && (
                            <div style={{display:"flex",gap:5}}>
                              <button onClick={()=>setReservas(rs=>rs.map(x=>x.id===r.id?{...x,estado:"Confirmada"}:x))}
                                style={{padding:"3px 9px",background:"#F0FFF4",color:"#276749",border:"1px solid #C6F6D5",borderRadius:5,fontSize:10,fontWeight:600,cursor:"pointer"}}>
                                Aprobar
                              </button>
                              <button onClick={()=>setReservas(rs=>rs.map(x=>x.id===r.id?{...x,estado:"Cancelada"}:x))}
                                style={{padding:"3px 9px",background:"#FFF5F5",color:"#C53030",border:"1px solid #FED7D7",borderRadius:5,fontSize:10,fontWeight:600,cursor:"pointer"}}>
                              Rechazar
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{...card, marginTop:16}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div style={{fontWeight:700,fontSize:13}}>Calendario maestro de disponibilidad</div>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <select value={calProp} onChange={e=>setCalProp(+e.target.value)}
                      style={{padding:"4px 8px",border:"1px solid #CBD5E0",borderRadius:6,fontSize:11}}>
                      {INIT_PROPS.map(p=>(
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <button onClick={()=>setShowBloqueo(!showBloqueo)}
                      style={{padding:"4px 12px",background:C.navy,color:"white",border:"none",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer"}}>
                      + Bloqueo manual
                    </button>
                  </div>
                </div>
                {showBloqueo && (
                  <div style={{background:"#F7FAFC",borderRadius:8,padding:12,marginBottom:14,display:"flex",gap:10,alignItems:"flex-end"}}>
                    <div>
                      <label style={lbl}>Fecha a bloquear</label>
                      <input type="date" value={nuevaFecha} onChange={e=>setNuevaFecha(e.target.value)} style={inp()}/>
                    </div>
                    <button onClick={()=>{
                      if(nuevaFecha){ setBloqueos(bs=>[...bs,{propId:calProp,fecha:nuevaFecha}]); setNuevaFecha(""); setShowBloqueo(false); }
                    }} style={{padding:"8px 14px",background:C.greenB,color:"white",border:"none",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer"}}>
                      Confirmar
                    </button>
                    <button onClick={()=>setShowBloqueo(false)}
                      style={{padding:"8px 14px",background:"none",color:C.muted,border:"none",fontSize:11,cursor:"pointer"}}>
                      Cancelar
                    </button>
                  </div>
                )}
                <div style={{fontWeight:600,fontSize:12,color:C.muted,marginBottom:8}}>Julio 2026</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
                  {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map(d=>(
                    <div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:C.muted,paddingBottom:6}}>{d}</div>
                  ))}
                  {Array.from({length:31},(_,i)=>{
                    const dia = i+1;
                    const fecha = `2026-07-${String(dia).padStart(2,"0")}`;
                    const reserva = reservas.find(r=>r.propId===calProp&&r.entrada<=fecha&&r.salida>fecha&&r.estado==="Confirmada");
                    const bloqueado = bloqueos.find(b=>b.propId===calProp&&b.fecha===fecha);
                    const bg = reserva?"#BEE3F8":bloqueado?"#FED7D7":"#F7FAFC";
                    const tc = reserva?"#2A4365":bloqueado?"#742A2A":"#4A5568";
                    return (
                      <div key={dia} style={{textAlign:"center",padding:"6px 2px",borderRadius:6,background:bg,fontSize:11,fontWeight:600,color:tc}}>
                        {dia}
                      </div>
                    );
                  })}
                </div>
                <div style={{display:"flex",gap:16,marginTop:12}}>
                  {[["#BEE3F8","#2A4365","Reservada"],["#FED7D7","#742A2A","Bloqueada"],["#F7FAFC","#4A5568","Disponible"]].map(([bg,tc,l])=>(
                    <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:tc}}>
                      <div style={{width:12,height:12,borderRadius:3,background:bg,border:"1px solid #E2E8F0"}}/>
                      {l}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ── PAGOS ── */}
          {manTab==="pagos" && (
            <div style={{padding:20}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18}}>
                {[
                  {l:"Ingresos este mes",   v:"$4,400",ic:"💰",bg:"#F0FFF4",tc:"#276749"},
                  {l:"Pagos completados",   v:"2",     ic:"✅",bg:"#EBF8FF",tc:"#2A4365"},
                  {l:"Pagos pendientes",    v:"2",     ic:"⏳",bg:"#FFFBEB",tc:"#744210"},
                ].map((c,i)=>(
                  <div key={i} style={{...card,display:"flex",gap:10,alignItems:"center",padding:14}}>
                    <div style={{background:c.bg,borderRadius:7,padding:8,fontSize:20}}>{c.ic}</div>
                    <div>
                      <div style={{fontSize:10,color:C.muted,fontWeight:600}}>{c.l}</div>
                      <div style={{fontSize:18,fontWeight:800,color:c.tc}}>{c.v}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{...card,padding:0,overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{background:"#F7FAFC"}}>
                      {["ID Pago","Reserva","Inquilino","Monto","Fecha","Método","Estado"].map(h=>(
                        <th key={h} style={th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PAGOS.map((p,i)=>(
                      <tr key={p.id}>
                        <td style={{...td(i),color:C.lav,fontWeight:600,fontSize:11}}>{p.id}</td>
                        <td style={{...td(i),fontSize:11}}>{p.res}</td>
                        <td style={{...td(i),fontWeight:600,color:"#2D3748",fontSize:12}}>{p.quien}</td>
                        <td style={{...td(i),fontWeight:700}}>${p.monto}</td>
                        <td style={{...td(i),color:C.muted,fontSize:11}}>{p.fecha}</td>
                        <td style={td(i)}><span style={{background:"#EDF2F7",color:"#4A5568",padding:"1px 7px",borderRadius:9,fontSize:10,fontWeight:600}}>{p.met}</span></td>
                        <td style={td(i)}><Badge text={p.estado}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── INTELIGENCIA OPERATIVA ── */}
          {manTab==="intel" && (
            <div style={{padding:20}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                {/* LightGBM */}
                <div style={card}>
                  <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:3}}>
                    <span style={{fontSize:16}}>🤖</span>
                    <div style={{fontWeight:700,fontSize:13}}>Sugerencias de Precio</div>
                  </div>
                  <div style={{fontSize:10,color:C.muted,marginBottom:12}}>Sugerencias basadas en demanda y competencia</div>
                  {ML.filter(m=>m.act!==m.sug).map((m,i)=>(
                    <div key={i} style={{borderBottom:"1px solid #F7FAFC",padding:"8px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:11,fontWeight:600,color:"#2D3748"}}>{m.prop}</div>
                        <div style={{fontSize:10,color:C.muted,marginTop:1}}>
                          Actual: <strong>${m.act}</strong> → Sugerido:{" "}
                          <strong style={{color:m.sug>m.act?"#276749":m.sug<m.act?C.red:C.muted}}>${m.sug}</strong>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <Badge text={m.dem}/>
                        {mlDecisions[m.prop] ? (
                          <span style={{fontSize:10,fontWeight:600,color:mlDecisions[m.prop]==="aceptada"?"#276749":C.muted}}>
                            {mlDecisions[m.prop]==="aceptada" ? "✓ Aceptada" : "Ignorada"}
                          </span>
                        ) : (
                          <div style={{display:"flex",gap:5}}>
                            <button onClick={()=>setMlDecisions({...mlDecisions,[m.prop]:"aceptada"})}
                              style={{padding:"3px 9px",background:"#F0FFF4",color:"#276749",border:"1px solid #C6F6D5",borderRadius:5,fontSize:10,fontWeight:600,cursor:"pointer"}}>
                              Aceptar
                            </button>
                            <button onClick={()=>setMlDecisions({...mlDecisions,[m.prop]:"ignorada"})}
                              style={{padding:"3px 9px",background:"#EDF2F7",color:"#718096",border:"none",borderRadius:5,fontSize:10,fontWeight:600,cursor:"pointer"}}>
                              Ignorar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Prophet */}
                <div style={card}>
                  <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:3}}>
                    <span style={{fontSize:16}}>📈</span>
                    <div style={{fontWeight:700,fontSize:13}}>Predicción de Ocupación</div>
                  </div>
                  <div style={{fontSize:10,color:C.muted,marginBottom:10}}>Forecast próximos 3 meses</div>
                  <ResponsiveContainer width="100%" height={205}>
                    <AreaChart data={OCUP}>
                      <defs>
                        <linearGradient id="og1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.lav} stopOpacity={0.3}/><stop offset="95%" stopColor={C.lav} stopOpacity={0}/></linearGradient>
                        <linearGradient id="og2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.green} stopOpacity={0.2}/><stop offset="95%" stopColor={C.green} stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F7FAFC"/>
                      <XAxis dataKey="m" tick={{fontSize:10}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fontSize:10}} axisLine={false} tickLine={false} domain={[50,100]} tickFormatter={v=>`${v}%`}/>
                      <Tooltip formatter={(v,n)=>[`${v}%`,n==="p"?"Predicción":"Real"]}/>
                      <Area type="monotone" dataKey="r" stroke={C.lav} fill="url(#og1)" strokeWidth={2} name="r" connectNulls={false}/>
                      <Area type="monotone" dataKey="p" stroke={C.green} fill="url(#og2)" strokeWidth={2} strokeDasharray="5 5" name="p"/>
                    </AreaChart>
                  </ResponsiveContainer>
                  <div style={{display:"flex",gap:14,justifyContent:"center",marginTop:6}}>
                    {[["Real",C.lav],["Predicción",C.green]].map(([l,col])=>(
                      <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:C.muted}}>
                        <div style={{width:14,height:2,background:col}}/>
                        {l}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );

  /* ════════════ TENANT ════════════ */
  if (page==="tenant") return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",fontFamily:"system-ui,sans-serif",fontSize:13}}>
      <Header title="" tenant={true}/>
      <div style={{flex:1,overflow:"auto",background:C.bg}}>

        {/* BUSCAR */}
        {tenTab==="buscar" && (
          <div style={{display:"flex",height:"calc(100vh - 54px)"}}>
            {/* Mapa con drag-scroll */}
            <style>{`[data-mapa]::-webkit-scrollbar{display:none}`}</style>
            <div style={{flex:1,position:"relative"}}>
              <div ref={mapRef} data-mapa
                onMouseDown={onMapDown} onMouseMove={onMapMove} onMouseUp={onMapUp} onMouseLeave={onMapUp}
                style={{position:"absolute",inset:0,overflow:"auto",cursor:"grab",userSelect:"none",scrollbarWidth:"none",msOverflowStyle:"none"}}>
                <div style={{width:1920,height:1080,position:"relative"}}>
                  <img src={imgMapa} alt="Mapa" draggable={false} style={{width:1920,height:1080,display:"block"}}/>

                {/* Marcadores */}
                {[
                  {grupo:"República",  x:955, y:360},
                  {grupo:"Inglaterra", x:895, y:620},
                  {grupo:"Pradera",    x:860, y:740},
                ].map(({grupo,x,y})=>{
                  const activo = grupoFiltro === grupo;
                  return (
                    <div key={grupo}
                      onClick={()=>setGrupoFiltro(activo ? null : grupo)}
                      style={{position:"absolute",left:x,top:y,transform:"translate(-50%,-100%)",cursor:"pointer",zIndex:10}}>
                      <MapPin size={60} fill={activo?C.navy:C.red} color="white" strokeWidth={1}/>
                    </div>
                  );
                })}
                </div>
              </div>

              {/* Barra de filtros */}
              <div style={{position:"absolute",top:14,left:14,display:"flex",gap:8,zIndex:20}}>
                <div onClick={()=>setShowFiltros(!showFiltros)}
                  style={{background:"white",borderRadius:8,boxShadow:"0 2px 8px rgba(0,0,0,.12)",display:"flex",alignItems:"center",padding:"7px 12px",gap:5,fontSize:12,cursor:"pointer"}}>
                  ⚙️ <span style={{fontWeight:600}}>Filtros</span> ▾
                  {showFiltros && (
                    <div onClick={e=>e.stopPropagation()}
                      style={{position:"absolute",top:48,left:0,background:"white",borderRadius:8,boxShadow:"0 4px 16px rgba(0,0,0,.12)",padding:16,zIndex:50,minWidth:260}}>
                      <div style={{fontWeight:700,fontSize:12,marginBottom:10}}>Filtrar propiedades</div>
                      <label style={lbl}>Precio máximo/noche (USD)</label>
                      <input type="range" min={20} max={100} value={precioMax}
                        onChange={e=>setPrecioMax(+e.target.value)}
                        style={{width:"100%",marginBottom:4}}/>
                      <div style={{fontSize:10,color:C.muted,marginBottom:10,textAlign:"right"}}>
                        Máximo: <strong>${precioMax}/noche</strong>
                      </div>
                      <label style={lbl}>Habitaciones</label>
                      <select style={{...inp(),marginBottom:10}}>
                        <option>Cualquiera</option>
                        <option>1 habitación</option>
                        <option>2 habitaciones</option>
                      </select>
                      <label style={lbl}>Servicios</label>
                      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12}}>
                        {["WiFi","Cocina","Parqueadero"].map(s=>(
                          <label key={s} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,cursor:"pointer"}}>
                            <input type="checkbox"/>{s}
                          </label>
                        ))}
                      </div>
                      <button style={{width:"100%",padding:"7px",background:C.navy,color:"white",border:"none",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer"}}>
                        Aplicar filtros
                      </button>
                    </div>
                  )}
                </div>
                <div style={{background:"white",borderRadius:8,boxShadow:"0 2px 8px rgba(0,0,0,.12)",display:"flex",alignItems:"center",padding:"7px 130px 7px 10px",gap:5,fontSize:12,color:C.muted}}>
                  🔍 Ingresa una dirección
                </div>
              </div>

              {/* Zoom */}
              <div style={{position:"absolute",bottom:18,right:18,display:"flex",flexDirection:"column",background:"white",borderRadius:6,boxShadow:"0 2px 8px rgba(0,0,0,.12)"}}>
                {["+","−"].map(z=>(
                  <button key={z} style={{padding:"5px 9px",border:"none",background:"none",cursor:"pointer",fontSize:15,fontWeight:700,color:"#4A5568",borderBottom:z==="+"?"1px solid #E2E8F0":"none"}}>{z}</button>
                ))}
              </div>
            </div>

            {/* Listings */}
            {(()=>{
              const lista = grupoFiltro ? T_PROPS.filter(p=>p.group===grupoFiltro) : T_PROPS;
              return (
                <div style={{width:285,background:"#F0F2F5",overflowY:"auto",padding:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <div style={{fontWeight:700,fontSize:13,color:"#2D3748"}}>{lista.length} propiedades disponibles</div>
                    {grupoFiltro && (
                      <button onClick={()=>setGrupoFiltro(null)}
                        style={{fontSize:10,background:"#EDF2F7",border:"none",borderRadius:10,padding:"2px 8px",cursor:"pointer",color:"#4A5568",fontWeight:600}}>
                        {grupoFiltro} ×
                      </button>
                    )}
                  </div>
                  {lista.map(p=>(
                    <div key={p.id}
                      onClick={()=>{ setSelProp(p); setResvDone(false); setTenTab("detalle"); }}
                      style={{background:"white",borderRadius:10,marginBottom:12,overflow:"hidden",cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,.08)"}}>
                      <div style={{position:"relative"}}>
                        <img src={p.img} alt={p.name} style={{width:"100%",height:74,objectFit:"cover",display:"block"}}/>
                        <span style={{position:"absolute",top:6,left:6,background:"#38A169",color:"white",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20}}>Disponible</span>
                      </div>
                      <div style={{padding:10}}>
                        <div style={{fontSize:11,fontWeight:700,color:"#2D3748",marginBottom:1}}>{p.name}</div>
                        <div style={{fontSize:10,color:C.muted}}>{p.addr}</div>
                        <div style={{fontSize:10,color:C.muted}}>{p.rooms} habitaciones</div>
                        <div style={{fontSize:14,fontWeight:800,color:C.lav,marginTop:4}}>${p.price}<span style={{fontSize:9,fontWeight:400,color:C.muted}}>/noche</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* DETALLE */}
        {tenTab==="detalle" && selProp && (
          <div style={{padding:24,maxWidth:680,margin:"0 auto"}}>
            <button onClick={()=>setTenTab("buscar")} style={{background:"none",border:"none",cursor:"pointer",color:C.lav,fontWeight:600,marginBottom:14,fontSize:12}}>← Volver</button>
            <div style={{background:"white",borderRadius:12,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.08)"}}>
              <div style={{position:"relative"}}>
                <img src={selProp.img} alt={selProp.name} style={{width:"100%",height:260,objectFit:"cover",display:"block"}}/>
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"40px 22px 16px",background:"linear-gradient(transparent,rgba(0,0,0,0.65))",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                  <span style={{background:"#38A169",color:"white",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,display:"inline-block"}}>
                    💡 Buen momento para reservar
                  </span>
                  <div style={{background:"rgba(27,55,100,0.85)",color:"white",fontSize:22,fontWeight:800,padding:"4px 12px",borderRadius:8}}>
                    ${selProp.price}<span style={{fontSize:11,fontWeight:400}}>/noche</span>
                  </div>
                </div>
              </div>
              <div style={{padding:22}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:14}}>
                  <div>
                    <div style={{fontSize:18,fontWeight:800,textAlign:"center"}}>{selProp.name}</div>
                    <div style={{fontSize:12,color:C.muted,marginTop:3}}>📍 {selProp.addr}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:10,marginBottom:16}}>
                  {[["🛏️",`${selProp.rooms} hab.`],["👤","2 huéspedes"],["📐","45 m²"]].map(([ic,l])=>(
                    <div key={l} style={{background:"#F7FAFC",borderRadius:7,padding:"6px 12px",display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#4A5568"}}>{ic} {l}</div>
                  ))}
                </div>
                <div style={{marginBottom:16}}>
                  <div style={{fontWeight:700,fontSize:12,marginBottom:6}}>Descripción</div>
                  <div style={{fontSize:12,color:"#4A5568",lineHeight:1.65}}>Amplio espacio en el sector de La Carolina, norte de Quito. Excelentes acabados y acceso completo a servicios básicos. Ideal para estadías cortas o largas.</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderTop:"1px solid #EDF2F7",borderBottom:"1px solid #EDF2F7",marginBottom:16}}>
                  <span style={{fontSize:20}}>💡</span>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:"#276749"}}>Precio por debajo del promedio histórico</div>
                    <div style={{fontSize:10,color:C.muted}}>Promedio zona: $42/noche · Tendencia: estable</div>
                  </div>
                </div>
                <button onClick={()=>{ setResvDone(false); setTenTab("reservar"); }}
                  style={{width:"100%",padding:"13px",background:C.greenB,color:"white",border:"none",borderRadius:9,fontWeight:700,cursor:"pointer",fontSize:14}}>
                  Reservar ahora
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RESERVAR */}
        {tenTab==="reservar" && (
          <div style={{padding:24,maxWidth:480,margin:"0 auto"}}>
            {resvDone ? (
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:400,textAlign:"center"}}>
                <div style={{fontSize:64,marginBottom:24}}>✅</div>
                <div style={{fontSize:20,fontWeight:800,color:"#276749",marginBottom:8}}>¡Reserva confirmada!</div>
                <div style={{fontSize:12,color:C.muted,marginBottom:24}}>Tu reserva ha sido enviada al gestor. Recibirás un correo de confirmación.</div>
                <button onClick={()=>{ setTenTab("buscar"); setResvForm({entrada:"",salida:""}); }}
                  style={{padding:"10px 24px",background:C.greenB,color:"white",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer",fontSize:14}}>
                  Volver al inicio
                </button>
              </div>
            ) : (
              <>
                <button onClick={()=>setTenTab("detalle")} style={{background:"none",border:"none",cursor:"pointer",color:C.lav,fontWeight:600,marginBottom:14,fontSize:12}}>← Volver</button>
                <div style={{...card}}>
                  <div style={{fontWeight:800,fontSize:15,marginBottom:2}}>Completar reserva</div>
                  <div style={{fontSize:11,color:C.muted,marginBottom:18}}>{selProp?.name}</div>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                    <div><label style={lbl}>Fecha de entrada</label>
                      <input type="date" value={resvForm.entrada} onChange={e=>setResvForm({...resvForm,entrada:e.target.value})} style={inp()}/>
                    </div>
                    <div><label style={lbl}>Fecha de salida</label>
                      <input type="date" value={resvForm.salida} onChange={e=>setResvForm({...resvForm,salida:e.target.value})} style={inp()}/>
                    </div>
                  </div>
                  <div style={{background:"#F7FAFC",borderRadius:8,padding:12,marginBottom:12}}>
                    <div style={{fontSize:10,color:C.muted,fontWeight:600,marginBottom:4}}>Reservando como</div>
                    <div style={{fontSize:12,fontWeight:700}}>Arrendatario Demo</div>
                    <div style={{fontSize:11,color:C.muted}}>arrendatario@email.com</div>
                  </div>

                  {/* Summary */}
                  <div style={{background:"#F7FAFC",borderRadius:8,padding:12,marginBottom:16}}>
                    <div style={{fontWeight:700,fontSize:12,marginBottom:8}}>Resumen de pago</div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.muted,marginBottom:3}}>
                      <span>${selProp?.price}/noche × {nights()} noches</span>
                      <span>${(selProp?.price||0)*nights()}</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.muted,marginBottom:8}}>
                      <span>Cargo de servicio</span><span>$3</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:13,borderTop:"1px solid #E2E8F0",paddingTop:8}}>
                      <span>Total</span>
                      <span style={{color:C.lav}}>${(selProp?.price||0)*nights()+3}</span>
                    </div>
                  </div>

                  {/* Kushki */}
                  <div style={{fontWeight:700,fontSize:11,color:"#4A5568",marginBottom:8}}>Método de pago (Kushki)</div>
                  <input placeholder="Número de tarjeta" style={{...inp(),marginBottom:8}}/>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
                    <input placeholder="MM/AA" style={inp()}/>
                    <input placeholder="CVV"   style={inp()}/>
                  </div>

                  <button onClick={()=>setResvDone(true)}
                    style={{width:"100%",padding:"13px",background:C.greenB,color:"white",border:"none",borderRadius:9,fontWeight:700,cursor:"pointer",fontSize:14}}>
                    Confirmar y pagar
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* MIS RESERVAS */}
        {tenTab==="mis-res" && (
          <div style={{padding:24,maxWidth:680,margin:"0 auto"}}>
            <div style={{fontWeight:800,fontSize:15,marginBottom:16}}>Mis Reservas</div>
            {MIS_RESERVAS.map((r,i)=>{
              const pago = undefined;
              return (
                <div key={i} style={{...card,marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:13,color:"#2D3748",marginBottom:4}}>{r.prop}</div>
                      <div style={{fontSize:11,color:C.muted,marginTop:2}}>{r.entrada} → {r.salida} · {r.canal}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <Badge text={r.estado}/>
                      <div style={{fontWeight:700,marginTop:6,color:C.lav}}>${r.monto}</div>
                    </div>
                  </div>
                  {pago && (
                    <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #EDF2F7",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{fontSize:10,color:C.muted}}>💳 Pago · {pago.met} · {pago.fecha}</div>
                      <Badge text={pago.estado}/>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* MI CUENTA */}
        {tenTab==="mi-cuenta" && (
          <div style={{padding:24,maxWidth:680,margin:"0 auto"}}>
            <div style={{fontWeight:800,fontSize:15,marginBottom:16}}>Mi Cuenta</div>
            <div style={{...card,marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
                <div style={{width:52,height:52,borderRadius:"50%",background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:800,fontSize:18}}>A</div>
                <div>
                  <div style={{fontWeight:700,fontSize:14}}>Arrendatario Demo</div>
                  <div style={{fontSize:11,color:C.muted}}>arrendatario@email.com</div>
                </div>
              </div>
              {[["Nombre completo","Arrendatario Demo"],["Correo electrónico","arrendatario@email.com"],["Teléfono","+593 99 000 0000"],["País","Ecuador"]].map(([label,val])=>(
                <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid #EDF2F7",fontSize:12}}>
                  <span style={{color:C.muted}}>{label}</span>
                  <span style={{fontWeight:600}}>{val}</span>
                </div>
              ))}
              <div style={{marginTop:16,display:"flex",justifyContent:"flex-end"}}>
                <button onClick={()=>setPage("login")}
                  style={{padding:"7px 18px",background:C.red,color:"white",border:"none",borderRadius:6,cursor:"pointer",fontSize:10,fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
                  ⏻ Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  return null;
}