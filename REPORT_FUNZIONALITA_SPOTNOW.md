# SpotNow - Report Dettagliato Funzionalità per Ruolo

## Indice
1. [Utente (User)](#utente-user)
2. [Amministratore (Admin)](#amministratore-admin)
3. [Supervisore (Supervisor)](#supervisore-supervisor)
4. [Operatore (Operator)](#operatore-operator)
5. [Punto Vendita / Venditore (Ticket Point)](#punto-vendita-venditore-ticket-point)

---

## Utente (User)

### 1. Dashboard Parcheggi
#### Visualizzazione Mappa Interattiva
- Mappa OpenStreetMap (Leaflet.js) con visualizzazione posti auto disponibili
- Marker colorati per stato parcheggio (verde=libero, rosso=occupato, viola=in scadenza)
- Clustering automatico dei marker quando zoom ridotto
- Cambio vista mappa (satellite/stradale)
- Geolocalizzazione in tempo reale con aggiornamento automatico
- Ricerca per indirizzo con Nominatim (OpenStreetMap)

#### Ricerca e Filtri Parcheggi
- **Filtri per Stato**:
  - Disponibili (verde)
  - Occupati (rosso)
  - In scadenza (viola)
- **Filtri per Tipo Veicolo**:
  - Auto
  - Moto
  - Bicicletta
- **Ordinamento**:
  - Per distanza (più vicini prima)
  - Per tempo (posti che si liberano prima)
  - Per priorità (posti in scadenza)
- **Filtro Comunale**: mostra solo parcheggi su strada (esclusi coperti/scoperti)

#### Informazioni Parcheggio
- Codice stallo (es: AA001, AA009)
- Indirizzo completo con geocodifica automatica
- Distanza in linea d'aria (metri se <1km, altrimenti km)
- Prezzo orario (€/ora)
- Stato disponibilità con countdown tempo
- Tipo veicolo supportato (icone)
- Tipo parcheggio (strada/coperto/scoperto)

### 2. Prenotazione Parcheggio
#### Processo di Prenotazione
- Selezione spot dalla mappa o lista
- Scelta veicolo registrato
- Selezione durata parcheggio (slider 30-480 minuti)
- Calcolo costo in tempo reale con applicazione sconti abbonamento
- Visualizzazione orario inizio/fine stimato

#### Metodi di Pagamento
- **Carta di Credito**: pagamento con carta salvata
- **Contanti**: generazione QR code da validare al punto vendita
  - QR Code con timer scadenza (60 minuti)
  - ID transazione univoco
  - Dettagli parcheggio inclusi
- **Credito**: utilizzo saldo credito utente
- **Misto**: combinazione carta + credito

#### Parcheggi Coperti/Scoperti
- Prenotazione con fascia oraria specifica (entry/exit time)
- Costo calcolato per finestra temporale esatta
- Workflow di prenotazione diretta

### 3. Gestione Sessioni Attive
#### Timer Parcheggio in Corso
- Visualizzazione countdown tempo rimanente
- Indicatore visivo stato (verde/giallo/rosso)
- Dettagli: spot, durata, costo, orario fine
- Notifiche sonore quando mancano 5 minuti

#### Azioni su Sessione Attiva
- **Estendi Parcheggio**: aggiungi tempo (15/30/60 min)
- **Termina Parcheggio**: rilascio anticipato spot
- **Visualizza Ricevuta**: scarica PDF ricevuta

### 4. Profilo Utente
#### Dati Personali
- Foto profilo (upload HD fino a 10MB, PNG/JPEG/WebP)
- Nome e cognome
- Email (non modificabile)
- Telefono
- Comune di residenza (selettore con 8.092 comuni italiani)
- Modifica dati personali
- Cambio password

#### Gestione Veicoli
- **Aggiungi veicolo**:
  - Targa (validazione formato)
  - Tipo (auto/moto/bicicletta)
  - Marca e modello
  - Colore
  - Imposta come predefinito
- **Modifica veicolo**: aggiorna dettagli esistenti
- **Elimina veicolo**: rimozione con conferma

#### Metodi di Pagamento
- **Aggiungi carta**:
  - Numero carta (16 cifre)
  - Nome intestatario
  - Data scadenza (MM/YY)
  - CVV (3 cifre)
  - Imposta come predefinita
- **Modifica carta**: aggiorna dettagli
- **Elimina carta**: rimozione con conferma

#### Credito e Transazioni
- Visualizzazione saldo credito corrente (€)
- Storico transazioni credito con:
  - Tipo (addebito/ricarica/abbonamento)
  - Importo
  - Data
  - Descrizione
  - Saldo dopo transazione

### 5. Abbonamenti
#### Visualizzazione Piani
- Elenco piani disponibili per il comune dell'utente
- Dettagli piano:
  - Nome (es: "Mensile 10%", "Annuale 20%")
  - Prezzo (€/mese o €/anno)
  - Percentuale sconto su parcheggi
  - Comuni coperti
  - Caratteristiche incluse

#### Gestione Abbonamento
- **Sottoscrivi**: attivazione piano con pagamento carta
- **Visualizza attivo**: dettagli abbonamento corrente
  - Data inizio/fine
  - Stato (attivo/scaduto)
  - Sconto applicato
- **Annulla**: cancellazione abbonamento con conferma

### 6. Cronologia
- Visualizzazione prenotazioni passate
- Dettagli: spot, data/ora, durata, costo, metodo pagamento
- Ricevute scaricabili in PDF

### 7. Ricevute PDF
- Generazione automatica al termine parcheggio
- Contenuto ricevuta:
  - Logo SpotNow
  - Numero ricevuta univoco
  - Data e ora emissione
  - Dati utente (nome, email)
  - **Numero stallo in grassetto blu** (es: AA009)
  - Indirizzo parcheggio
  - Targa veicolo
  - Durata e orari inizio/fine
  - Importo pagato e metodo
  - Sconto abbonamento applicato
- Download multilingua (italiano/inglese)

### 8. Raccomandazioni AI
- Suggerimenti intelligenti basati su:
  - Posizione utente
  - Ora del giorno
  - Disponibilità posti
  - Prezzi zone
  - Abbonamento attivo
- Powered by Google Gemini AI
- Massimo 3 suggerimenti ordinati per rilevanza

### 9. Notifiche
- Notifiche push per:
  - Parcheggio in scadenza (5 minuti prima)
  - Pagamento confermato
  - Abbonamento scaduto
  - Credito in esaurimento
- Suoni di notifica personalizzati

### 10. Impostazioni
- **Cambio lingua**: Italiano ↔ Inglese
- **Aiuto**: guida utilizzo app
- **Termini e Condizioni**: consultazione
- **Privacy Policy**: consultazione
- **Logout**: disconnessione account

---

## Amministratore (Admin)

### 1. Dashboard
- Vista mappa completa con tutti i parcheggi del sistema
- Visualizzazione zone e stalli
- Modalità sola visualizzazione (no prenotazioni)

### 2. Statistiche
#### Metriche Principali
- Totale parcheggi (disponibili/occupati)
- Tasso occupazione per zona
- Entrate giornaliere/mensili
- Numero utenti attivi
- Prenotazioni totali
- Violazioni pendenti

#### Grafici e Report
- Grafico occupazione ultimi 7 giorni
- Entrate per zona
- Distribuzione tipologia veicoli
- Trend abbonamenti

### 3. Gestione Zone
#### Creazione Zona
- Nome zona
- Comune di appartenenza (selettore Italia)
- Disegno poligono su mappa (Leaflet.draw - in migrazione)
- Descrizione
- Tariffa associata
- Restrizioni (orari, veicoli)
- Numero totale stalli

#### Modifica Zona
- Aggiornamento coordinate poligono
- Cambio tariffa
- Modifica restrizioni
- Stato (attiva/disattivata)

#### Eliminazione Zona
- Rimozione completa con conferma
- Controllo dipendenze (stalli esistenti)

#### Editor Layout Stalli
- Creazione manuale stalli su mappa
- Posizionamento marker preciso
- Assegnazione codice stallo progressivo (es: AA001, AA002...)
- Codice zona univoco auto-generato (2 lettere per comune)
- Tipo veicolo per stallo
- Tipo parcheggio (strada/coperto/scoperto)
- Salvataggio coordinate GPS precise

### 4. Gestione Utenti
#### Visualizzazione Utenti
- Elenco completo utenti sistema
- Filtri:
  - Per ruolo (user/admin/operator/supervisor/ticket_point)
  - Per comune
  - Per regione/provincia
- Ricerca per nome/email/ID
- Paginazione (20 utenti per pagina)

#### Operazioni Utente
- **Crea utente**:
  - Email, password, nome, cognome
  - Ruolo
  - Comune
  - Telefono
- **Modifica utente**:
  - Dati anagrafici
  - Comune assegnato
  - Saldo credito
- **Cambia ruolo**: promozione/retrocessione ruolo
- **Reset password**: invio link reset via email
- **Elimina utente**: rimozione account con conferma

### 5. Gestione Tariffe
#### Creazione Tariffa
- Nome tariffa
- Zone applicabili (selezione multipla)
- **Tipo tariffazione**:
  - **Oraria**: prezzo fisso €/ora
  - **Progressiva**: prezzo crescente per fasce
- Configurazione fasce orarie:
  - Giorni settimana
  - Orario inizio/fine
  - Prezzo specifico

#### Esempio Tariffa Progressiva
```
Lun-Ven 08:00-12:00 → €2.00/h
Lun-Ven 12:00-20:00 → €3.50/h
Sab-Dom tutto il giorno → €2.50/h
```

#### Gestione Tariffa
- Modifica prezzi e fasce
- Assegnazione a nuove zone
- Attivazione/disattivazione
- Eliminazione (con controllo zone associate)

### 6. Gestione Abbonamenti
#### Piani Abbonamento
- **Crea piano**:
  - Nome piano
  - Descrizione
  - Prezzo (€)
  - Durata (mesi)
  - Percentuale sconto parcheggi (%)
  - Comuni coperti (selezione multipla)
  - Caratteristiche incluse
- **Modifica piano**: aggiorna dettagli
- **Elimina piano**: rimozione con verifica abbonati attivi

#### Tipologie Comuni
- Globale (nessun comune = valido ovunque)
- Singolo comune
- Multi-comune (es: area metropolitana)

### 7. Gestione Permessi
#### Creazione Permesso Speciale
- Targa veicolo autorizzato
- Zone con accesso gratuito
- Data inizio validità
- Data fine validità
- Note (es: "Disabile", "Autorità", "Residenti ZTL")

#### Gestione Permessi
- Visualizzazione elenco permessi
- Filtri per zona/targa/scadenza
- Modifica permesso esistente
- Eliminazione permesso
- Verifica validità

### 8. Monitoraggio Operatori
#### Dashboard Operatori
- Elenco operatori attivi
- Statistiche per operatore:
  - Controlli effettuati (totale/oggi)
  - Violazioni segnalate (totale/oggi)
  - Tasso rilevamento (%)
- Filtri per comune/periodo

#### Dettagli Attività
- Log controlli veicoli con:
  - Targa controllata
  - Ora/data
  - Esito (valido/scaduto/non trovato)
  - Posizione GPS
- Log violazioni segnalate con:
  - Targa
  - Tipo violazione
  - Foto allegate
  - Stato (pendente/confermata/pagata)

### 9. Report e Contabilità
#### Transazioni
- Elenco tutte le transazioni sistema
- Filtri:
  - Per tipo (parcheggio/abbonamento/credito)
  - Per metodo pagamento
  - Per zona
  - Per data
  - Per utente
- Esportazione CSV/Excel

#### Report Finanziari
- Entrate giornaliere/mensili/annuali
- Suddivisione per:
  - Zona
  - Tipologia pagamento
  - Abbonamenti vs singoli
- Commissioni punto vendita
- Statistiche IVA

### 10. Commissioni Punto Vendita
- Visualizzazione transazioni contanti
- Calcolo commissioni per punto vendita (%)
- Report dettagliato per venditore
- Periodo analisi personalizzabile

### 11. Impostazioni Generali
#### Configurazione Sistema
- Nome applicazione
- Logo personalizzato
- Colori tema
- Email notifiche sistema
- SMS gateway configurazione
- Integrazione Gemini AI API key (per raccomandazioni intelligenti)

#### Configurazione Email
- Server SMTP
- Template email (benvenuto, reset password, ricevute)
- Firma email

### 12. Log Attività
- Registro completo azioni amministrative:
  - Chi (utente)
  - Cosa (azione)
  - Quando (timestamp)
  - Su cosa (risorsa ID)
  - Dettagli modifiche
- Filtri per utente/azione/data
- Audit trail completo

---

## Supervisore (Supervisor)

**Nota**: Il supervisore ha tutte le funzionalità dell'amministratore, ma limitate al proprio comune di competenza.

### Funzionalità Identiche ad Admin (con scope comunale)
1. Dashboard parcheggi (solo comune assegnato)
2. Statistiche (solo dati comune)
3. Gestione zone (crea/modifica zone nel proprio comune)
4. Gestione tariffe (tariffe zone proprie)
5. Gestione abbonamenti (piani per proprio comune)
6. Gestione permessi (permessi nel proprio comune)
7. Monitoraggio operatori (operatori del comune)
8. Report contabilità (transazioni zona)

### Restrizioni vs Admin
- **NO eliminazione zone** (solo admin)
- **NO cambio ruolo utente** (solo visualizzazione)
- **NO modifica utenti admin/supervisor** (solo utenti comuni)
- **NO accesso dati altri comuni**
- **NO modifica impostazioni globali sistema**

### Gestione Utenti Supervisionati
#### Visualizzazione
- Solo utenti del proprio comune
- Esclusi altri admin/supervisor dalla vista

#### Operazioni Limitate
- Può creare utenti (user/operator/ticket_point) nel suo comune
- Può resettare password utenti comuni
- Può eliminare solo user/operator/ticket_point
- **NON PUÒ** modificare ruoli
- **NON PUÒ** eliminare admin/supervisor

### Log Attività Comunale
- Visualizzazione completa attività nel comune:
  - Controlli operatori
  - Violazioni segnalate
  - Prenotazioni utenti
  - Modifiche zone/tariffe
- Grafici trend settimanale
- Statistiche operatore più attivo
- Tasso violazioni

---

## Operatore (Operator)

### 1. Controllo Veicoli
#### Inserimento Targa
- **Tastiera alfanumerica custom**:
  - Cifre 0-9
  - Lettere A-Z
  - Backspace
  - Invio
- Design ottimizzato per mobile
- Input maiuscolo automatico
- Validazione formato targa italiana

#### Verifica Parcheggio
- Ricerca automatica prenotazione attiva
- **Risultati possibili**:
  - **VALIDO** (verde): parcheggio pagato e valido
  - **SCADUTO** (giallo): parcheggio scaduto
  - **NON TROVATO** (rosso): nessun pagamento

#### Dettagli Controllo
- Targa veicolo
- Stato pagamento
- Orario inizio/fine parcheggio
- Spot occupato
- Nome utente
- Tempo rimanente (se valido)
- Posizione GPS controllo
- Timestamp controllo

### 2. Segnalazione Violazioni
#### Workflow Violazione
Attivabile quando:
- Parcheggio scaduto
- Parcheggio non trovato
- Parcheggio in zona vietata

#### Dettagli Violazione
- **Targa** (precompilata dal controllo)
- **Tipo violazione**:
  - Parcheggio scaduto
  - Parcheggio non pagato
  - Sosta vietata
  - Parcheggio zona disabili
  - Doppia fila
  - Passo carrabile
  - Altro (personalizzato)
- **Note aggiuntive** (campo testo libero)
- **Importo multa** (€, opzionale)

#### Foto Evidenza
- **Scatta foto** (fotocamera dispositivo):
  - Foto frontale veicolo
  - Foto targa
  - Foto contesto/posizione
  - Fino a 4 foto per violazione
- **Visualizzazione anteprime** con opzione elimina
- **Ottimizzazione automatica** dimensione foto

#### Allegati PDF
- **Upload documento PDF**:
  - Verbale precompilato
  - Documentazione aggiuntiva
  - Massimo 5MB per file
- **Nome file personalizzato**
- **Visualizzazione anteprima** documento

#### Posizione GPS
- Acquisizione automatica coordinate
- Visualizzazione indirizzo da coordinate
- Precisione GPS con accuracy indicator

#### Invio Segnalazione
- Validazione campi obbligatori
- Salvataggio nel sistema
- Generazione numero report univoco
- Conferma visiva invio

### 3. Storico Controlli
#### Visualizzazione Cronologia
- Elenco tutti i controlli effettuati
- **Informazioni per controllo**:
  - Targa
  - Data/ora
  - Esito (valido/scaduto/non trovato)
  - Posizione
- **Filtri**:
  - Per data (range personalizzabile)
  - Per esito
  - Per targa (ricerca)
- Ordinamento cronologico (più recenti prima)

### 4. Storico Violazioni
#### Visualizzazione Segnalazioni
- Elenco violazioni segnalate dall'operatore
- **Dettagli per violazione**:
  - Numero report
  - Targa
  - Tipo violazione
  - Data/ora segnalazione
  - Stato (pendente/confermata/annullata/pagata)
- **Visualizzazione dettagliata**:
  - Tutte le foto allegate
  - Documento PDF allegato
  - Note complete
  - Timeline aggiornamenti stato

#### Filtri Violazioni
- Per stato
- Per data
- Per tipo violazione
- Per targa

### 5. Log Attività Combinato
- **Visualizzazione unificata** controlli + violazioni
- **Tabs**:
  - Tutti (misto)
  - Solo controlli
  - Solo violazioni
- Statistiche rapide:
  - Controlli oggi
  - Violazioni oggi
  - Tasso rilevamento

### 6. Esportazione Dati
#### Export Report Violazioni
- Genera PDF con tutte le violazioni filtrate
- Include:
  - Testata con data generazione
  - Tabella completa violazioni
  - Colonne: targa, report, operatore, data, stato, note
- Download diretto PDF

### 7. Modalità Offline
#### Funzionamento Senza Connessione
- **Coda sincronizzazione**:
  - Controlli memorizzati localmente
  - Violazioni salvate in pending
  - Foto compresse e accodate
- **Indicatore stato online/offline**
- **Auto-sync** quando connessione torna
- **Avvisi** sincronizzazione in corso

### 8. Dashboard Operatore
- **Statistiche personali**:
  - Controlli totali
  - Controlli oggi
  - Violazioni totali
  - Violazioni oggi
  - Media controlli/giorno
- **Badge achievements** (opzionale):
  - 100 controlli
  - Prima violazione
  - Settimana perfetta

---

## Punto Vendita / Venditore (Ticket Point)

### 1. Validazione Transazioni Contanti
#### Scanner QR Code
- **Scansione automatica**:
  - Attivazione fotocamera dispositivo
  - Rilevamento QR code real-time
  - Feedback visivo (cornice verde quando rilevato)
  - Supporto camera ambiente o frontale
- **Compatibilità Browser**:
  - Chrome/Edge (Barcode Detection API)
  - Safari iOS (WebCodecs fallback)
  - Messaggio errore se non supportato

#### Inserimento Manuale
- Campo input ID transazione
- Validazione formato
- Conferma manuale
- Fallback se scanner non disponibile

#### Processo Validazione
1. Scansione/inserimento ID transazione
2. Verifica validità (timeout 60 minuti)
3. Controllo stato (non già confermata)
4. Conferma transazione
5. Registrazione timestamp validazione
6. Registrazione ID punto vendita
7. Creazione prenotazione attiva
8. Generazione ricevuta PDF automatica

#### Dettagli Transazione
- ID transazione univoco
- Utente (nome)
- Veicolo (targa)
- Spot prenotato (codice + indirizzo)
- Durata parcheggio (minuti)
- Costo totale (€)
- Credito applicato (se presente)
- Timestamp creazione
- Timestamp validazione
- Stato (pending/confirmed/expired)

### 2. Gestione Transazioni
#### Visualizzazione Transazioni
- **Tab "In Attesa"**:
  - Transazioni pending non ancora validate
  - Ordine cronologico (più recenti prima)
  - Countdown scadenza (60 min)
  - Badge "IN ATTESA" rosso
- **Tab "Confermate"**:
  - Transazioni già validate
  - Data/ora conferma
  - Punto vendita confermante
  - Badge "CONFERMATO" verde

#### Informazioni per Transazione
- Card dettagliata con:
  - ID transazione (codice alfanumerico)
  - Nome utente
  - Targa veicolo
  - Spot (codice + indirizzo completo)
  - Importo totale (€)
  - Stato con badge colorato
  - Timer scadenza (se pending)

### 3. Statistiche Dashboard
#### Card Metriche
- **Totale Transazioni**:
  - Numero totale gestite
  - Icona documento
- **In Attesa Validazione**:
  - Numero pending correnti
  - Icona orologio
  - Alert se > 5
- **Confermate Oggi**:
  - Numero validate oggi
  - Icona check
  - Aggiornamento real-time
- **Importo Oggi**:
  - Somma € transazioni giornaliere
  - Icona euro
  - Formattazione valuta

### 4. Report e Rendicontazione
#### Visualizzazione Report
- **Filtri Periodo**:
  - Oggi
  - Ultimi 7 giorni
  - Ultimo mese
  - Personalizzato (da/a)
- **Riepilogo**:
  - Numero transazioni
  - Importo totale incassato
  - Commissione punto vendita
  - Dettaglio per tipologia

#### Esportazione
- Export Excel transazioni periodo
- Report PDF riepilogativo
- Include:
  - Testata punto vendita
  - Periodo analisi
  - Tabella transazioni
  - Totali e commissioni

### 5. Gestione Errori
#### Messaggi Utente
- **QR Code Invalido**:
  - "Codice QR non valido. Riprovare o inserire manualmente."
- **Transazione Scaduta**:
  - "Questo codice QR è scaduto (oltre 60 minuti)."
- **Già Confermata**:
  - "Biglietto già convalidato il [data/ora]."
- **ID Non Trovato**:
  - "ID transazione non trovato. Controllare il codice."

#### Gestione Fallimenti
- Retry automatico scansione
- Suggerimento inserimento manuale
- Log errori per supporto tecnico
- Modalità offline con sync pending

### 6. Impostazioni Punto Vendita
#### Configurazione
- Nome punto vendita
- Indirizzo fisico
- Comune di competenza
- Orari apertura
- Contatti (telefono/email)
- Logo personalizzato

#### Commissioni
- Visualizzazione percentuale commissione
- Calcolo automatico su ogni transazione
- Report commissioni maturate
- Periodo rendicontazione

### 7. Interfaccia Utente
#### Design Ottimizzato
- **Mobile-first**: ottimizzato per tablet/smartphone
- **Card grandi**: facile touch su dispositivi mobili
- **Colori distintivi**:
  - Verde: confermate/valide
  - Rosso: in attesa/scadute
  - Blu: informazioni
- **Icone intuitive**: Font Awesome per azioni
- **Badge stato**: visual feedback immediato

#### Accessibilità
- Testo grande e leggibile
- Alto contrasto
- Navigazione semplificata
- Conferme azioni importanti
- Messaggi errore chiari

### 8. Sicurezza
#### Protezione Dati
- Autenticazione obbligatoria
- Sessione con timeout
- Validazione lato server
- Log completo operazioni
- Audit trail transazioni

#### Prevenzione Frodi
- Timeout transazioni (60 min)
- Validazione una tantum per QR
- Registro timestamp completo
- Impossibile doppia validazione
- Tracciabilità punto vendita

---

## Riepilogo Comparativo Ruoli

| Funzionalità | User | Admin | Supervisor | Operator | Ticket Point |
|-------------|------|-------|------------|----------|--------------|
| Prenota parcheggio | ✅ | ❌ | ❌ | ❌ | ❌ |
| Visualizza mappa | ✅ | ✅ (view) | ✅ (view) | ❌ | ❌ |
| Gestisci veicoli | ✅ | ❌ | ❌ | ❌ | ❌ |
| Gestisci pagamenti | ✅ | ❌ | ❌ | ❌ | ❌ |
| Abbonamenti | ✅ | ✅ (crea) | ✅ (crea) | ❌ | ❌ |
| Crea zone | ❌ | ✅ | ✅ (suo comune) | ❌ | ❌ |
| Elimina zone | ❌ | ✅ | ❌ | ❌ | ❌ |
| Gestisci utenti | ❌ | ✅ (tutti) | ✅ (comune) | ❌ | ❌ |
| Cambia ruoli | ❌ | ✅ | ❌ | ❌ | ❌ |
| Gestisci tariffe | ❌ | ✅ | ✅ (sue zone) | ❌ | ❌ |
| Crea permessi | ❌ | ✅ | ✅ (comune) | ❌ | ❌ |
| Controlla veicoli | ❌ | ❌ | ❌ | ✅ | ❌ |
| Segnala violazioni | ❌ | ❌ | ❌ | ✅ | ❌ |
| Valida contanti | ❌ | ❌ | ❌ | ❌ | ✅ |
| Visualizza statistiche | ❌ | ✅ (globali) | ✅ (comune) | ✅ (personali) | ✅ (punto vendita) |
| Report finanziari | ❌ | ✅ (tutti) | ✅ (comune) | ❌ | ✅ (proprie) |

---

## Note Tecniche

### Tecnologie Utilizzate
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Neon)
- **Mappe**: OpenStreetMap + Leaflet.js + Nominatim + OSRM
- **AI**: Google Gemini
- **PWA**: Service Worker, Manifest, Offline support
- **PDF**: jsPDF + jspdf-autotable
- **QR**: qrcode library
- **Geolocalizzazione**: watchPosition API con enableHighAccuracy

### Lingue Supportate
- **Italiano** (default)
- **Inglese**
- Cambio lingua in tempo reale
- Persistenza preferenza in localStorage
- Traduzioni complete incluse ricevute PDF

### Compatibilità
- **Browser**:
  - Chrome 90+
  - Firefox 88+
  - Safari 14+
  - Edge 90+
- **Mobile**:
  - iOS 14+
  - Android 9+
- **PWA**: installabile come app nativa su iOS/Android

### Sicurezza
- Autenticazione JWT
- RBAC (Role-Based Access Control)
- Scope comunale per supervisor
- Validazione input lato client e server
- Sanitizzazione dati
- HTTPS obbligatorio in produzione
- Secrets management integrato

---

**Documento generato il**: 05 Novembre 2025  
**Versione App**: SpotNow v1.0  
**Autore**: Sistema SpotNow
