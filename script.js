const CATS={voice:["Voix / données","VLAN voix, PoE, DHCP, QoS"],cme:["Téléphonie sur site","CME, ephone, ephone-dn, SRST"],sites:["Échanges inter-sites","Dial-peer, trunk SIP, VPN"],iptv:["IPTV","Multicast, IGMP, PIM, VOD"],uc:["Communications unifiées","Présence, softphone, SIP, WebRTC"],qos:["QoS & sécurité","Priorisation, ACL, VPN, qualité de service"],secu:["Sécurité réseau","ACL, NAT, VPN, 802.1X, filtrage"],switching:["Commutateurs","STP, VTP, trunks, redondance"],sva:["Services à valeur ajoutée","Définition, SLA, support, bénéfices métier"]};
/* c=catégorie, t=type (qcm|cmd|cfg) */
const Q=[
{c:"voice",t:"qcm",q:`Pourquoi sépare-t-on la voix et les données dans des VLAN distincts ?`,o:["Pour augmenter la bande passante du lien","Pour appliquer la QoS, limiter la diffusion et sécuriser le trafic voix","Pour supprimer le besoin de PoE","Pour éviter d’utiliser des adresses IP"],a:1,e:`Un VLAN voix isole le trafic temps réel (broadcast réduit, QoS ciblée, sécurité) du trafic de données.`},
{c:"voice",t:"cmd",q:`Sur le port Fa0/1 d’un switch Cisco, quelle commande déclare le VLAN 20 comme VLAN voix ?`,o:["switchport voice vlan 20","switchport access vlan 20","switchport trunk allowed vlan 20","vlan voice 20"],a:0,e:`<code>switchport voice vlan 20</code> : le port reste en access pour le PC (VLAN data) et le téléphone est placé dans le VLAN voix.`},
{c:"voice",t:"qcm",q:`Quel protocole permet au switch d’annoncer au téléphone IP le VLAN voix à utiliser ?`,o:["STP","LLDP-MED (ou CDP chez Cisco)","RIP","SNMP trap"],a:1,e:`LLDP-MED (standard) ou CDP (Cisco) transmettent le VLAN voix et la demande de puissance PoE.`},
{c:"voice",t:"qcm",q:`Quelle option DHCP indique l’adresse du serveur TFTP aux téléphones Cisco ?`,o:["Option 3","Option 6","Option 66","Option 150"],a:3,e:`L’option 150 (propriétaire Cisco) donne la liste des serveurs TFTP ; l’option 66 est la version standard à nom unique.`},
{c:"voice",t:"qcm",q:`Quelle norme PoE fournit jusqu’à 30 W par port ?`,o:["802.3af","802.3at (PoE+)","802.1Q","802.1X"],a:1,e:`802.3af = 15,4 W, 802.3at = 30 W, 802.3bt = jusqu’à 60/90 W.`},
{c:"voice",t:"qcm",q:`Quelle valeur DSCP marque habituellement le flux voix (RTP) ?`,o:["EF (46)","AF11","CS0","CS6"],a:0,e:`EF (Expedited Forwarding, 46) pour la voix ; la signalisation utilise souvent CS3/AF31.`},
{c:"voice",t:"cmd",q:`Quelle commande vérifie la configuration du VLAN voix d’un port ?`,o:["show interfaces fa0/1 switchport","show ip route","show vlan voice","show running-config vlan"],a:0,e:`<code>show interfaces fa0/1 switchport</code> affiche le « Access Mode VLAN » et le « Voice VLAN ».`},
{c:"voice",t:"cfg",q:`Complétez la configuration du port d’un poste de travail avec téléphone IP (VLAN data 10, VLAN voix 20).`,tpl:`vlan 10
 name DATA
vlan 20
 name VOICE
interface FastEthernet0/1
 switchport mode {{0}}
 switchport access vlan {{1}}
 switchport voice vlan {{2}}
 spanning-tree portfast`,k:[["access"],["10"],["20"]],e:`Le port est en mode access ; le VLAN data 10 pour le PC, le VLAN voix 20 pour le téléphone.`},
{c:"voice",t:"cfg",q:`Complétez le pool DHCP des téléphones (VLAN voix 192.168.20.0/24, serveur TFTP = 192.168.20.1).`,tpl:`ip dhcp pool VOICE
 network 192.168.20.0 255.255.255.0
 default-router 192.168.20.1
 option {{0}} ip 192.168.20.1`,k:[["150"]],e:`L’option 150 transmet l’adresse du serveur TFTP au téléphone.`},
{c:"cme",t:"qcm",q:`Que fait Cisco Unified Communications Manager Express (CME) ?`,o:["Il filtre les paquets comme un pare-feu","Il transforme un routeur en PABX IP pour petites et moyennes structures","Il diffuse la télévision en multicast","Il remplace le DNS"],a:1,e:`CME est un PABX IP intégré au routeur IOS (jusqu’à quelques centaines de postes).`},
{c:"cme",t:"cmd",q:`Quelle commande affiche les téléphones enregistrés sur CME ?`,o:["show ephone registered","show dial-peer voice summary","show ip igmp groups","show telephony registered"],a:0,e:`<code>show ephone registered</code> liste les ephones enregistrés avec leur adresse IP et leur état.`},
{c:"cme",t:"qcm",q:`Dans CME, à quoi sert un « ephone-dn » ?`,o:["Il représente le téléphone physique (MAC)","Il représente une ligne/numéro de poste (directory number)","Il définit le VLAN voix","Il crée un trunk SIP"],a:1,e:`ephone-dn = le numéro (ligne) ; ephone = le terminal physique auquel on associe cette ligne via <code>button</code>.`},
{c:"cme",t:"qcm",q:`Que permet SRST / CME en mode secours (survivabilité) ?`,o:["Chiffrer les appels","Continuer les appels locaux si le lien WAN vers le serveur d’appel central tombe","Doubler le débit du WAN","Convertir la voix en vidéo"],a:1,e:`SRST fait reprendre l’enregistrement des téléphones par le routeur local quand le contrôleur d’appels central est injoignable.`},
{c:"cme",t:"cfg",q:`Complétez la configuration CME : service téléphonie sur 192.168.20.1, poste 1001 sur le bouton 1 de l’ephone 1.`,tpl:`telephony-service
 max-ephones 10
 max-dn 10
 ip source-address 192.168.20.1 port {{0}}
 auto assign 1 to 10
ephone-dn 1
 number {{1}}
ephone 1
 mac-address 0011.2233.4455
 type 7960
 button 1:{{2}}`,k:[["2000"],["1001"],["1"]],e:`Port SCCP par défaut : 2000. <code>button 1:1</code> associe le bouton 1 à l’ephone-dn 1.`},
{c:"sites",t:"qcm",q:`Pour relier deux sites distants en téléphonie IP, quel élément indique au routeur comment atteindre les postes de l’autre site ?`,o:["Une route statique par défaut seulement","Un dial-peer (VoIP) avec destination-pattern et session target","Un VLAN voix","Un pool DHCP"],a:1,e:`Le dial-peer VoIP associe un motif de numéros à l’IP du routeur distant.`},
{c:"sites",t:"cfg",q:`Site A (postes 1xxx) appelle le site B (postes 2000–2999, routeur 10.0.0.2). Complétez le dial-peer.`,tpl:`dial-peer voice 100 {{0}}
 destination-pattern {{1}}
 session target ipv4:{{2}}
 codec g711ulaw`,k:[["voip"],["2...","2[0-9][0-9][0-9]","2xxx"],["10.0.0.2"]],e:`Le point « . » est un joker : <code>2...</code> correspond à 2 suivi de trois chiffres.`},
{c:"sites",t:"cfg",q:`Autorisez le SIP vers SIP sur le routeur pour un trunk inter-sites.`,tpl:`voice service voip
 allow-connections {{0}} to {{1}}
 sip
  bind control source-interface GigabitEthernet0/0
  bind media source-interface GigabitEthernet0/0`,k:[["sip"],["sip"]],e:`Sans <code>allow-connections sip to sip</code>, un routeur refuse de relayer un appel SIP vers un autre trunk SIP.`},
{c:"sites",t:"cmd",q:`Quelle commande résume les dial-peers configurés ?`,o:["show dial-peer voice summary","show voip dial","show ephone summary","show sip peers"],a:0,e:`<code>show dial-peer voice summary</code> donne l’état (admin/oper) de chaque dial-peer.`},
{c:"sites",t:"qcm",q:`Quel codec consomme environ 8 kb/s (hors en-têtes) et convient aux liaisons WAN limitées ?`,o:["G.711","G.722","G.729","Opus 128"],a:2,e:`G.729 ≈ 8 kb/s, G.711 = 64 kb/s.`},
{c:"sites",t:"qcm",q:`Comment sécuriser le trafic voix échangé entre deux sites sur Internet ?`,o:["Le laisser en clair, la voix n’est pas sensible","Via un VPN IPsec site-à-site (et SRTP/TLS si possible)","En désactivant la QoS","En utilisant le port 80"],a:1,e:`Un tunnel IPsec ou GRE sur IPsec protège la signalisation et le média entre les sites.`},
{c:"iptv",t:"qcm",q:`Pourquoi l’IPTV en direct utilise-t-elle le multicast ?`,o:["Pour envoyer un seul flux partagé par tous les spectateurs d’une chaîne","Pour chiffrer le flux","Pour remplacer le DHCP","Pour augmenter la latence"],a:0,e:`Le multicast évite de dupliquer le flux pour chaque spectateur : la bande passante dépend du nombre de chaînes, pas du nombre d’abonnés.`},
{c:"iptv",t:"qcm",q:`Quelle plage d’adresses est réservée au multicast IPv4 ?`,o:["10.0.0.0/8","224.0.0.0/4","192.168.0.0/16","127.0.0.0/8"],a:1,e:`224.0.0.0 – 239.255.255.255 (classe D).`},
{c:"iptv",t:"qcm",q:`Quel protocole permet à un décodeur de rejoindre ou quitter un groupe multicast ?`,o:["ICMP","IGMP","OSPF","ARP"],a:1,e:`IGMP (Internet Group Management Protocol) : join/leave entre le récepteur et le routeur.`},
{c:"iptv",t:"cmd",q:`Quelle commande active le routage multicast sur un routeur Cisco ?`,o:["ip multicast-routing","multicast enable","ip pim enable","ip igmp routing"],a:0,e:`<code>ip multicast-routing</code> en mode global, puis <code>ip pim</code> sur les interfaces.`},
{c:"iptv",t:"cmd",q:`Quelle commande affiche les groupes multicast auxquels des récepteurs sont abonnés ?`,o:["show ip igmp groups","show ip mroute summary only","show ip pim neighbor","show ip route multicast"],a:0,e:`<code>show ip igmp groups</code> liste les groupes, interfaces et dernier reporter. <code>show ip mroute</code> montre l’arbre de distribution.`},
{c:"iptv",t:"cfg",q:`Complétez le routage multicast IPTV (mode sparse) et l’IGMP snooping sur le switch.`,tpl:`ip multicast-{{0}}
interface Vlan50
 ip pim {{1}}
 ip igmp version 2
!
! sur le switch d’accès
ip igmp {{2}}`,k:[["routing"],["sparse-mode"],["snooping"]],e:`Sans snooping, le switch inonde le flux multicast sur tous les ports du VLAN.`},
{c:"iptv",t:"qcm",q:`La VOD (vidéo à la demande) est diffusée en…`,o:["Broadcast","Multicast uniquement","Unicast (un flux par spectateur)","Anycast uniquement"],a:2,e:`La VOD est personnelle (pause, avance rapide) donc en unicast ; la TV linéaire est en multicast.`},
{c:"uc",t:"qcm",q:`Que regroupent les communications unifiées (UC) ?`,o:["Seulement la téléphonie","Voix, vidéo, messagerie instantanée, présence, conférence et partage dans une même interface","Seulement la messagerie e-mail","Le routage et la commutation"],a:1,e:`L’UC unifie les canaux et ajoute la présence, la mobilité et l’intégration aux outils métiers.`},
{c:"uc",t:"qcm",q:`Quel port TCP/UDP est le port SIP par défaut (non chiffré) ?`,o:["5060","443","3389","161"],a:0,e:`SIP : 5060 (UDP/TCP) ; SIP sur TLS : 5061.`},
{c:"uc",t:"qcm",q:`Quel protocole transporte le flux audio/vidéo d’un appel SIP ?`,o:["RTP/SRTP","SMTP","FTP","SNMP"],a:0,e:`SIP signale (établit l’appel), RTP transporte les médias, SRTP les chiffre.`},
{c:"uc",t:"qcm",q:`Quel service UC indique si un collègue est disponible, occupé ou absent ?`,o:["La présence","Le NAT","Le VPN","La QoS"],a:0,e:`La présence (XMPP/SIP SIMPLE) est au cœur de la collaboration.`},
{c:"uc",t:"qcm",q:`Quelle technologie permet des appels audio/vidéo directement dans le navigateur sans plugin ?`,o:["WebRTC","Telnet","POP3","H.320"],a:0,e:`WebRTC utilise SRTP, ICE/STUN/TURN et des API navigateur.`},
{c:"uc",t:"qcm",q:`Seuils recommandés pour la voix : latence max, gigue max ?`,o:["150 ms et 30 ms","1 s et 500 ms","500 ms et 100 ms","10 ms et 1 ms"],a:0,e:`Recommandation UIT G.114 : ≤ 150 ms (sens unique), gigue ≤ 30 ms, pertes ≤ 1 %.`},
{c:"qos",t:"qcm",q:`À quoi sert la QoS dans un réseau de téléphonie IP ?`,o:["À sécuriser les mots de passe","À prioriser les flux temps réel comme la voix et la vidéo","À remplacer le DHCP","À activer l’IPTV en multicast"],a:1,e:`La QoS évite que la voix soit perturbée par les fichiers lourds ou le trafic Internet.`},
{c:"qos",t:"qcm",q:`Que mesure la gigue dans une transmission réseau ?`,o:["Le nombre de paquets perdus","Les variations de délai de paquet à paquet","Le débit maximum en Mbps","La qualité du Wi‑Fi"],a:1,e:`La gigue correspond à la variabilité de la latence, très gênante pour la voix.`},
{c:"qos",t:"cmd",q:`Quelle commande Cisco affiche la politique QoS appliquée sur une interface ?`,o:["show policy-map interface GigabitEthernet0/0","show ip access-list","show vlan brief","show ephone summary"],a:0,e:`<code>show policy-map interface</code> montre les classes, compteurs et action appliquée.`},
{c:"qos",t:"cfg",q:`Complétez la class-map de voix en se basant sur le DSCP EF.`,tpl:`class-map match-any {{0}}
 match dscp {{1}}
!
policy-map OUT_TO_WAN
 class {{2}}
  priority {{3}}`,k:[["VOICE"],["46"],["VOICE"],["1000"]],e:`Le DSCP EF = 46 et la priorité est généralement configurée sur un débit suffisant pour la voix.`},
{c:"qos",t:"qcm",q:`Quelle règle est la plus adaptée pour bloquer le trafic Web non désiré depuis un réseau interne vers Internet ?`,o:["Un ACL de contrôle d’accès sur la sortie Internet","Un VLAN voix","Une route statique par défaut","Un NTP client"],a:0,e:`Une ACL filtrante sur le périphérique de bordure limite les flux autorisés ou refusés.`},
{c:"qos",t:"qcm",q:`Quel mécanisme protège un appel SIP et le média RTP lorsqu’un site parle à un autre site sur Internet ?`,o:["IPSec/VPN et SRTP/TLS si possible","Le simple NAT","Un VLAN sans QoS","La seule commande <code>switchport voice vlan</code>"],a:0,e:`La sécurisation des communications inter-sites repose sur le VPN (IPsec) et parfois sur SRTP/TLS pour les flux médias et la signalisation.`},
{c:"secu",t:"qcm",q:`À quoi sert le NAT sur un routeur de bordure ?`,o:["À accélérer le Wi‑Fi","À masquer des adresses privées derrière une IP publique","À remplacer le VLAN","À filtrer les paquets IPX"],a:1,e:`Le NAT permet de cacher les adresses privées (RFC1918) derrière une ou plusieurs adresses publiques.`},
{c:"secu",t:"cmd",q:`Quelle commande Cisco montre les ACL appliquées sur une interface ?`,o:["show access-lists","show ip route","show spanning-tree","show ephone registered"],a:0,e:`<code>show access-lists</code> affiche les règles, le nombre de paquets matchés et les interfaces concernées.`},
{c:"secu",t:"qcm",q:`Que protège un VPN IPsec ?`,o:["Seuls les ports virtuels","Les flux IP chiffrés entre deux points distants","Le service DNS local","La topologie STP"],a:1,e:`Le VPN IPsec sécurise le trafic entre sites en chiffrant le trafic IP sur le tunnel.`},
{c:"secu",t:"cfg",q:`Complétez une ACL simples sur le routeur pour autoriser le trafic SSH depuis 192.168.10.0/24 vers le réseau interne.`,tpl:`ip access-list extended SSH-IN
 permit tcp 192.168.10.0 0.0.0.255 host 10.0.0.5 eq {{0}}
 deny ip any any`,k:[["22"]],e:`Le port SSH est le 22. La règle permit autorise explicitement cette source vers la destination ciblée.`},
{c:"switching",t:"qcm",q:`Quel mécanisme évite les boucles L2 sur un réseau de commutateurs ?`,o:["STP","NAT","QoS","IGMP"],a:0,e:`Le Spanning Tree Protocol (STP) désactive les chemins redondants pour éviter les boucles de commutation.`},
{c:"switching",t:"cmd",q:`Quelle commande Cisco affiche l’état STP des ports d’un switch ?`,o:["show spanning-tree summary","show ip ospf neighbor","show interfaces trunk","show vlan brief"],a:0,e:`<code>show spanning-tree summary</code> donne l’état général et les informations de convergence STP.`},
{c:"switching",t:"qcm",q:`Quel port est utilisé par défaut pour un trunk 802.1Q ?`,o:["Le port est le même que l’accès","Aucun port n’existe : le trunk est une configuration propre au port","Les ports sont regroupés par VLAN sans configuration","Le port doit être en mode DHCP"],a:1,e:`Un trunk est configuré sur un port de switch, pas sur une couche logicielle séparée. Le mode trunk est activé sur le port concerné.`},
{c:"switching",t:"cfg",q:`Complétez la configuration d’un trunk entre deux switches sur l’interface Gi0/1.`,tpl:`interface GigabitEthernet0/1
 switchport mode {{0}}
 switchport trunk encapsulation dot1q
 switchport trunk allowed vlan {{1}},{{2}}`,k:[["trunk"],["10"],["20"]],e:`Le port est en mode trunk et les VLAN autorisés sont 10 et 20.`},
{c:"sva",t:"qcm",q:`Qu’est-ce qu’un service à valeur ajoutée (SVA) ?`,o:["Un produit physique livré sans support","Un service supplémentaire qui améliore l’expérience, la productivité ou la sécurité du client","Un type de protocole réseau","Une simple facture mensuelle"],a:1,e:`Un SVA apporte une fonctionnalité ou une expérience supérieure au service de base, souvent avec un impact métier clair.`},
{c:"sva",t:"qcm",q:`Quel exemple correspond bien à un SVA dans le secteur TIC ?`,o:["Un abonnement Internet basique seulement","Le Wi‑Fi géré, la sécurité renforcée, la téléphonie unifiée ou la visioconférence","La seule installation d’un routeur","Le remplacement d’un câble réseau"],a:1,e:`Les services gérés, la sécurité, les conférences et la mobilité sont des services additionnels à forte valeur ajoutée.`},
{c:"sva",t:"qcm",q:`Pourquoi une entreprise achète un SVA plutôt qu’un simple accès réseau ?`,o:["Parce que le SVA réduit le coût de l’électricité","Parce qu’il apporte un bénéfice fonctionnel, un gain de temps et souvent une meilleure qualité de service","Parce qu’il remplace le système d’exploitation","Parce que tout service est sans coût"],a:1,e:`Le SVA doit apporter une vraie valeur : productivité, sécurité, fiabilité, conformité ou expérience client.`},
{c:"sva",t:"qcm",q:`Que signifie SLA dans un contexte de service ?`,o:["Service Level Agreement","Switch Link Activation","Secure Local Access","Standard Local Architecture"],a:0,e:`Le SLA est un accord de niveau de service : disponibilité, performance, support, responsabilités et objectifs.`},
{c:"sva",t:"qcm",q:`Que mesure principalement un SLA ?`,o:["La couleur des écrans","La disponibilité, la performance, le temps de réponse et la qualité du support","Le nombre de cartes réseau d’un routeur","Le volume de données de stockage physique"],a:1,e:`Un SLA formalise les attentes et les indicateurs de performance du service.`},
{c:"sva",t:"qcm",q:`Quel indicateur est important pour la qualité de service client ?`,o:["Le temps moyen de résolution des incidents","Le nombre de VLANs sur un switch","L’adresse MAC des équipements","Le niveau de luminosité du bureau"],a:0,e:`Le temps de résolution, la disponibilité et la satisfaction client sont des KPI essentiels.`},
{c:"sva",t:"qcm",q:`Quel élément est essentiel pour qu’un service soit considéré comme “géré” ?`,o:["Une simple installation initiale","Un suivi, un monitoring, une maintenance et une assistance","Un contrat de location sans support","Un seul achat de matériel"],a:1,e:`Les services gérés incluent supervision, correctifs, incident management et amélioration continue.`},
{c:"sva",t:"qcm",q:`À quoi sert la gestion de la qualité de service (QoS) dans un service à valeur ajoutée ?`,o:["À sécuriser les fichiers sur disque","À prioriser les flux critiques comme la voix ou les transactions métiers","À remplacer les sauvegardes","À simplifier le design visuel"],a:1,e:`La QoS évite que les applications critiques soient perturbées par des flux moins prioritaires.`},
{c:"sva",t:"qcm",q:`Quel est l’intérêt d’une offre de service intégrée à valeur ajoutée ?`,o:["Elle simplifie la gestion pour le client et améliore la continuité, la sécurité et la productivité","Elle ajoute uniquement des coûts inutiles","Elle remplace totalement les besoins internes","Elle supprime la nécessité d’une assistance"],a:0,e:`Une offre intégrée réduit les silos, centralise les responsabilités et améliore la cohérence du service.`},
{c:"sva",t:"qcm",q:`Quelles sont les bases d’un bon service client dans une offre SVA ?`,o:["La documentation, la maintenance proactive, le support, et l’alignement sur les besoins métiers","Une communication uniquement annuelle","Une absence totale de suivi technique","Une politique de refus des incidents"],a:0,e:`Le succès d’un SVA repose sur la compréhension du besoin, la fiabilité et l’assistance continue.`},
{c:"sva",t:"qcm",q:`Quel concept décrit la capacité d’un service à rester opérationnel malgré une panne ou une perturbation ?`,o:["La continuité de service","Le NAT statique","Le mode trunk","Le multicast"],a:0,e:`La continuité de service assure que les fonctions critiques restent disponibles lors d’une alerte ou d’un incident.`},
{c:"sva",t:"qcm",q:`Quel est un bon indicateur pour évaluer l’efficacité du support d’un service SVA ?`,o:["Le temps moyen de résolution des incidents (MTTR)","La longueur des câbles installés","Le nombre de ports disponibles sur les switches","Le fabricant de routeur"],a:0,e:`Le MTTR est un KPI clé pour mesurer la réactivité et l’efficacité du support.`}
];
const $=s=>document.querySelector(s),app=$("#app");
let list,i,score,res,done;
const shuffle=a=>{a=[...a];for(let j=a.length-1;j>0;j--){const k=Math.random()*(j+1)|0;[a[j],a[k]]=[a[k],a[j]]}return a};
const TL={qcm:"QCM",cmd:"Commande",cfg:"Configuration à compléter"};
function home(){
  const n=c=>Q.filter(x=>x.c===c).length;
  app.innerHTML=`<h1>Quiz : services à valeur ajoutée</h1><p class="sub">Téléphonie sur site, séparation voix/données, échanges inter-sites, IPTV et communications unifiées. QCM, commandes et configurations à compléter.</p>
  <div class="cats">${Object.entries(CATS).map(([k,v])=>`<button data-c="${k}"><b>${v[0]}</b><small>${v[1]} · ${n(k)} questions</small></button>`).join("")}
  <button data-c="all" class="primary"><b>Tout le quiz</b><small style="color:#fff">${Q.length} questions mélangées</small></button></div>`;
  app.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>start(b.dataset.c));
}
function start(c){list=shuffle(Q.filter(x=>c==="all"||x.c===c));i=0;score=0;res=[];show()}
function show(){
  const x=list[i];done=false;
  let body="";
  if(x.t==="cfg"){
    body=`<div class="cfg" id="cfg">${x.tpl.replace(/\{\{(\d)\}\}/g,(m,n)=>`<input data-n="${n}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Champ ${+n+1}">`)}</div>
    <div class="row"><button class="primary" id="chk">Valider</button></div>`;
  }else{
    const correct=x.o[x.a],opts=shuffle(x.o);
    body=`<div class="opts ${x.t}">${opts.map(o=>`<button data-v="${o.replace(/"/g,"&quot;")}">${o}</button>`).join("")}</div>`;
    x._c=correct;
  }
  app.innerHTML=`<div class="meta"><span>Question ${i+1} / ${list.length}</span><span>Score : ${score}</span></div><div class="bar"><i style="width:${i/list.length*100}%"></i></div>
  <div class="card"><span class="tag">${CATS[x.c][0]}</span><span class="tag">${TL[x.t]}</span><p><b>${x.q}</b></p>${body}<div class="fb" id="fb"></div>
  <div class="row" id="nx" style="display:none"><button class="primary" id="next">${i+1<list.length?"Suivant":"Voir le résultat"}</button></div></div>`;
  if(x.t==="cfg"){
    $("#chk").onclick=()=>checkCfg(x);
    const ins=app.querySelectorAll(".cfg input");ins[0].focus();
    ins.forEach(el=>el.addEventListener("keydown",e=>{if(e.key==="Enter")checkCfg(x)}));
  }else app.querySelectorAll(".opts button").forEach(b=>b.onclick=()=>pick(x,b));
}
function feedback(x,ok){
  done=true;
  const fb=$("#fb");fb.style.display="block";fb.innerHTML=`<b>${ok?"Correct !":"Incorrect."}</b> ${x.e}`;
  $("#nx").style.display="flex";$("#next").onclick=()=>{i++;i<list.length?show():end()};
  if(ok)score++;
  res.push({q:x.q,ok});
}
function pick(x,b){
  if(done)return;
  const ok=b.dataset.v===x._c;
  app.querySelectorAll(".opts button").forEach(o=>{o.disabled=true;if(o.dataset.v===x._c)o.classList.add("ok")});
  if(!ok)b.classList.add("ko");
  feedback(x,ok);
}
function checkCfg(x){
  if(done)return;
  let all=true;
  app.querySelectorAll(".cfg input").forEach(el=>{
    const v=el.value.trim().toLowerCase(),good=x.k[+el.dataset.n].map(s=>s.toLowerCase()).includes(v);
    el.classList.add(good?"ok":"ko");el.disabled=true;
    if(!good){all=false;el.value=x.k[+el.dataset.n][0]}
  });
  $("#chk").disabled=true;
  feedback(x,all);
}
function end(){
  const p=Math.round(score/list.length*100);
  app.innerHTML=`<div class="card"><p class="sub">Résultat</p><div class="score">${score} / ${list.length} (${p} %)</div>
  <p>${p>=80?"Excellent, vous maîtrisez le sujet.":p>=50?"Bien, quelques notions à revoir.":"À retravailler : relisez les explications et recommencez."}</p>
  <div class="rev">${res.map(r=>`<p class="${r.ok?"y":"n"}">${r.ok?"✔":"✘"} ${r.q}</p>`).join("")}</div>
  <div class="row"><button class="primary" id="re">Rejouer</button><button id="hm">Choisir un thème</button></div></div>`;
  $("#re").onclick=()=>{list=shuffle(list);i=0;score=0;res=[];show()};
  $("#hm").onclick=home;
}
home();
