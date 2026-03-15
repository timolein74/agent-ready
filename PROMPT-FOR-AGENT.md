# Prompt toiselle agentille

Kopioi alla oleva teksti ja anna se toiselle agentille (esim. uusi chat tai toinen työkalu). Voit lisätä tiedoston HANDOFF.md kontekstiksi tai kertoa polun.

---

```text
Projekti: Agent-Ready API (erillinen tuote)

Konteksti:
- Tämä on spin-off tuote, joka alun perin julkaistiin npm:ssä nimellä @asterpay/agent-ready (v0.1.0). Päätös: tuote kehitetään tästä eteenpäin erillisenä projektina uudella tuote- tai yritysnimellä. Alkuperäistä @asterpay/agent-ready -pakettia ei enää ylläpidetä.
- Kehitys tapahtuu tässä hakemistossa: P:\2026\Cursor\agent ready API

Tehtäväsi:
1. Lue HANDOFF.md tästä hakemistosta (P:\2026\Cursor\agent ready API\HANDOFF.md). Siinä on koko konteksti: mitä tuote tekee, rakenne, lähdekoodin sijainti, viimeisimmät muutokset ja ohjeet uudelle kehittäjälle.
2. Päätä (tai kysy käyttäjältä) uusi tuote- tai yritysnimi. Poista viittaukset AsterPayhin ja @asterpay/agent-ready brändistä, paitsi jos käyttäjä haluaa pitää yhteensopivuuden.
3. Jos lähdekoodia ei vielä ole tässä hakemistossa: kopioi tai kloonaa pohja polusta c:\cursor\2026\payment layer\agent-ready (koko kansio: src, examples, package.json, tsconfig.json, README).
4. Rebrandoi projekti: päivitä package.json (name, description, repository, keywords), README, ja mahdolliset mainosdraftit (LAUNCH-MESSAGES.md, ANNOUNCE.md) uudella nimellä ja uudella npm-/repo-linkillä.
5. Jatkokehitys: kaikki uudet ominaisuudet, korjaukset ja julkaisut tehdään tässä projektissa. Uusi npm-paketti (esim. uudella nimellä) julkaistaan erikseen; vanhaa @asterpay/agent-ready ei muuteta.

Käytä HANDOFF.md:ää auktoriteettina rakenne, config-schema ja viime päivän muutokset -kohdissa.
```

---

**Lyhyempi vaihtoehto (jos agentti lukee HANDOFF.md:n itse):**

```text
Lue P:\2026\Cursor\agent ready API\HANDOFF.md ja toimi sen ohjeiden mukaan. Tämä projekti on Agent-Ready API -tuotteen jatkokehitys; alkuperäinen @asterpay/agent-ready jätetään npm:ään enää muuttamatta. Kehitä tätä projektia uudella tuote-/yritysnimellä tässä hakemistossa.
```
