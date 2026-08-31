<script setup lang="ts">
/**
 * TEMPORARY — `/design` route for a design partner to review the four visual
 * directions on prod. Delete this file + its route in `src/router/index.ts`
 * once a direction is chosen. Self-contained: injects its own Google Fonts
 * <link> on mount, all styles scoped under `.design-page`.
 */
import { onBeforeUnmount, onMounted } from 'vue'

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Anton&family=Archivo:ital,wght@0,400;0,600;0,700;0,800;1,600&family=Syne:wght@600;700;800&family=Manrope:wght@400;500;700;800&family=Shrikhand&family=Nunito:wght@400;700;800;900&family=Caveat:wght@600;700&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700;0,6..96,900;1,6..96,500&display=swap'

let linkEl: HTMLLinkElement | null = null

onMounted(() => {
  if (document.querySelector(`link[href="${FONT_HREF}"]`)) return
  linkEl = document.createElement('link')
  linkEl.rel = 'stylesheet'
  linkEl.href = FONT_HREF
  document.head.appendChild(linkEl)
})

onBeforeUnmount(() => {
  linkEl?.remove()
})
</script>

<template>
  <div class="design-page">
    <nav class="jump" aria-label="Saltar a una dirección">
      <ul>
        <li><a href="#cartel"><b>01</b> Cartel</a></li>
        <li><a href="#perreo"><b>02</b> Perreo 2000</a></li>
        <li><a href="#barrio"><b>03</b> Barrio</a></li>
        <li><a href="#expediente"><b>04</b> Expediente</a></li>
      </ul>
    </nav>

    <header class="mast wrap">
      <p class="kicker">Dirección de arte · Reggaetonero</p>
      <h1>Cuatro caras para el mismo juego</h1>
      <p class="standfirst">
        El juego ya funciona; la interfaz se ve como una plantilla — gris oscuro, un morado de
        acento, tarjetas redondeadas iguales, cero personalidad. Abajo hay cuatro direcciones
        visuales, cada una mostrada en pantallas reales con texto real del juego. El sistema de
        animación (los fuegos artificiales de los premios, la estrella que cae, la intro) se mantiene
        igual en todas.
      </p>

      <div class="rec">
        <div class="rec-head">
          <h2>Recomendación</h2>
          <span>de mayor a menor encaje</span>
        </div>
        <ol>
          <li>
            <b>Cartel</b><span class="tag">mi voto</span>
            <p>
              Es la única que suena como el juego ya escribe: tiraeras, rivales “aplaudiendo
              apretando la mandíbula”, la calle antes que la radio. La más distintiva y la que mejor
              se comparte — la carta de legado se vuelve un afiche.
            </p>
          </li>
          <li>
            <b>Barrio</b>
            <p>
              La respuesta más directa a “se ve hecho por IA”: es manual, cálida, imperfecta. Riesgo
              bajo de aburrir, pierde algo del filo cínico del texto.
            </p>
          </li>
          <li>
            <b>Perreo 2000</b>
            <p>
              Lo más cercano a lo actual y lo más barato de migrar. Divertida, pero el Y2K está de
              moda: hay que ejecutarlo muy fino para que no siga leyéndose como genérico.
            </p>
          </li>
          <li>
            <b>Expediente</b>
            <p>
              La más bonita y la que mejor envejece, pero demasiado compuesta para un juego sobre
              buscarse la vida. Encajaría si el tono girara hacia el documental serio.
            </p>
          </li>
        </ol>
      </div>

      <p class="howto">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.4" />
          <path d="M8 7v4.5M8 4.6v.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        </svg>
        Cada dirección muestra el logotipo, una decisión, la cabecera de partida y la carta de legado
        final.
      </p>
    </header>

    <main>
      <!-- ========================= 01 · CARTEL ========================= -->
      <section id="cartel" class="direction dir-cartel">
        <div class="wrap">
          <div class="spec">
            <p class="spec-kicker">Dirección 01</p>
            <h2 class="spec-name">Cartel</h2>
            <p class="spec-concept">
              Cartel de pelea de boxeo. El texto del juego ya está escrito como promoción de combate
              — esto lo hace literal.
            </p>
            <dl class="spec-meta">
              <div>
                <dt>Paleta</dt>
                <dd class="swatches">
                  <span class="swatch"><i style="background: #f1ece0"></i>#F1ECE0</span>
                  <span class="swatch"><i style="background: #16130f"></i>#16130F</span>
                  <span class="swatch"><i style="background: #cc2b1d"></i>#CC2B1D</span>
                  <span class="swatch"><i style="background: #c99a3a"></i>#C99A3A</span>
                </dd>
              </div>
              <div>
                <dt>Tipografía</dt>
                <dd>Anton (títulos, todo mayúsculas, apretado) · Archivo (texto)</dd>
              </div>
              <div>
                <dt>Textura</dt>
                <dd>
                  Semitono, grano de fotocopia, cintas, marcas de registro, fechas estampadas. Cero
                  esquinas redondeadas.
                </dd>
              </div>
              <div>
                <dt>Ideal para</dt>
                <dd>El filo cínico y combativo del guion. Cartas que se comparten como afiches.</dd>
              </div>
            </dl>
          </div>

          <div class="stage">
            <p class="stage-label">Logotipo</p>
            <div class="sample cartel-wm">
              <div class="big">Reggae<br />tonero</div>
              <div class="sub">Simulador de carrera musical</div>
            </div>

            <p class="stage-label">Una decisión</p>
            <div class="sample cartel-card">
              <div class="hd"><span>Año 4 · La movida</span><span class="risk">Riesgo medio</span></div>
              <div class="bd">
                <h3>Tu primer hater de verdad</h3>
                <p>
                  Alguien con más seguidores que tú se puso a bajarte en los comentarios y la gente lo
                  está compartiendo. Es feo, pero te están mirando.
                </p>
                <div class="cartel-choices">
                  <button type="button">Contestar con una tiraera</button>
                  <button type="button">Ignorarlo y seguir soltando música</button>
                  <button type="button">Reírte y hacer un meme con eso</button>
                </div>
              </div>
            </div>

            <p class="stage-label">Cabecera de partida</p>
            <div class="sample cartel-strip">
              <div class="top"><span>Año 4 · 25 años</span><span class="cartel-stars">&#9733;&#9733;&#189;</span></div>
              <div class="reads">
                <div><span>Dinero</span><b>$$</b></div>
                <div><span>Nombre</span><b>Suena</b></div>
                <div><span>Ciudad</span><b>Medellín</b></div>
              </div>
              <div class="cartel-rows">
                <div><span>22 · San Juan</span><span>&mdash;</span></div>
                <div><span>23 · Medellín</span><span class="cartel-stars">&#9733;&#9733;</span></div>
                <div><span>24 · Medellín</span><span><i>&#127915; 12k · &#127942; 1</i></span></div>
              </div>
            </div>

            <p class="stage-label">Legado final</p>
            <div class="sample cartel-verdict">
              <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
              <p class="eyebrow">Cómo se te va a recordar</p>
              <h3>El Rey<br />del Perreo</h3>
              <p class="epi">“No hubo tarima ni fiesta que no fuera tuya.”</p>
              <p class="legado">Legado 68 / 100</p>
              <div class="cartel-badge">CABEZA<br />DE<br />CARTEL</div>
            </div>

            <div class="sample cartel-logro">Nuevo logro &nbsp;·&nbsp; <b>Disco de platino</b></div>
          </div>
        </div>
      </section>

      <!-- ====================== 02 · PERREO 2000 ====================== -->
      <section id="perreo" class="direction dir-perreo">
        <div class="wrap">
          <div class="spec">
            <p class="spec-kicker">Dirección 02</p>
            <h2 class="spec-name">Perreo 2000</h2>
            <p class="spec-concept">
              Flyer de discoteca Y2K: cromo líquido, aubergine casi negro, neón. Lo más cercano a lo
              actual y lo más barato de migrar.
            </p>
            <dl class="spec-meta">
              <div>
                <dt>Paleta</dt>
                <dd class="swatches">
                  <span class="swatch"><i style="background: #0d0814"></i>#0D0814</span>
                  <span class="swatch"><i style="background: #ff3db4"></i>#FF3DB4</span>
                  <span class="swatch"><i style="background: #37e0ff"></i>#37E0FF</span>
                  <span class="swatch"><i style="background: #c6ff3d"></i>#C6FF3D</span>
                </dd>
              </div>
              <div>
                <dt>Tipografía</dt>
                <dd>Syne 800 con relleno cromado y bisel · Manrope (texto)</dd>
              </div>
              <div>
                <dt>Textura</dt>
                <dd>Brillos, destellos de lente, chispas, bordes de degradado, superficies de vidrio.</dd>
              </div>
              <div>
                <dt>Ideal para</dt>
                <dd>Energía de perreo y fiesta. Migración rápida — es “rematar” lo que ya hay.</dd>
              </div>
            </dl>
          </div>

          <div class="stage">
            <p class="stage-label">Logotipo</p>
            <div class="sample perreo-wm">
              <div class="big chrome">REGGAETONERO</div>
              <div class="sub">Simulador de carrera musical</div>
            </div>

            <p class="stage-label">Una decisión</p>
            <div class="sample perreo-card">
              <div class="inner">
                <span class="risk">Riesgo medio</span>
                <h3>Tu primer hater de verdad</h3>
                <p>
                  Alguien con más seguidores que tú se puso a bajarte en los comentarios y la gente lo
                  está compartiendo. Es feo, pero te están mirando.
                </p>
                <div class="perreo-choices">
                  <button type="button">Contestar con una tiraera</button>
                  <button type="button">Ignorarlo y seguir soltando música</button>
                  <button type="button">Reírte y hacer un meme con eso</button>
                </div>
              </div>
            </div>

            <p class="stage-label">Cabecera de partida</p>
            <div class="sample perreo-strip">
              <div class="top"><span class="yr">Año 4 · 25 años</span><span class="perreo-stars">&#9733;&#9733;&#189;</span></div>
              <div class="reads">
                <div><span>Dinero</span><b>$$</b></div>
                <div><span>Nombre</span><b>Suena</b></div>
                <div><span>Ciudad</span><b>Medellín</b></div>
              </div>
              <div class="perreo-rows">
                <div><span>22 · San Juan</span><span>&mdash;</span></div>
                <div><span>23 · Medellín</span><span class="perreo-stars">&#9733;&#9733;</span></div>
                <div><span>24 · Medellín</span><i>&#127915; 12k · &#127942; 1</i></div>
              </div>
            </div>

            <p class="stage-label">Legado final</p>
            <div class="sample perreo-verdict">
              <span class="spark"></span><span class="spark"></span><span class="spark"></span>
              <p class="eyebrow">Cómo se te va a recordar</p>
              <h3 class="chrome">EL REY DEL PERREO</h3>
              <p class="epi">“No hubo tarima ni fiesta que no fuera tuya.”</p>
              <p class="legado">Legado 68 / 100</p>
            </div>

            <div class="sample perreo-logro">Nuevo logro <b>Disco de platino</b></div>
          </div>
        </div>
      </section>

      <!-- ========================= 03 · BARRIO ========================= -->
      <section id="barrio" class="direction dir-barrio">
        <div class="wrap">
          <div class="spec">
            <p class="spec-kicker">Dirección 03</p>
            <h2 class="spec-name">Barrio</h2>
            <p class="spec-concept">
              Maximalismo hecho a mano, tipo portada de Bad Bunny: papel manila, tintas Riso mal
              registradas, rotulador, stickers. La respuesta más directa a “se ve hecho por IA”.
            </p>
            <dl class="spec-meta">
              <div>
                <dt>Paleta</dt>
                <dd class="swatches">
                  <span class="swatch"><i style="background: #efe7d6"></i>#EFE7D6</span>
                  <span class="swatch"><i style="background: #ff2d7e"></i>#FF2D7E</span>
                  <span class="swatch"><i style="background: #2f4bd8"></i>#2F4BD8</span>
                  <span class="swatch"><i style="background: #ffb32e"></i>#FFB32E</span>
                </dd>
              </div>
              <div>
                <dt>Tipografía</dt>
                <dd>Shrikhand (títulos, con sombra desplazada) · Nunito (texto) · Caveat (notas)</dd>
              </div>
              <div>
                <dt>Textura</dt>
                <dd>Grano de papel, doble impresión desalineada, subrayados a mano, corazones, stickers girados.</dd>
              </div>
              <div>
                <dt>Ideal para</dt>
                <dd>Calidez y cercanía. Se siente humano y de autor, nunca de plantilla.</dd>
              </div>
            </dl>
          </div>

          <div class="stage">
            <p class="stage-label">Logotipo</p>
            <div class="sample barrio-wm">
              <div class="big">Reggaetonero</div>
              <div class="swoosh"></div>
              <div class="sub">del barrio pa'l mundo</div>
            </div>

            <p class="stage-label">Una decisión</p>
            <div class="sample barrio-card">
              <span class="risk">riesgo medio</span>
              <h3>Tu primer hater de verdad</h3>
              <div class="u"></div>
              <p>
                Alguien con más seguidores que tú se puso a bajarte en los comentarios y la gente lo
                está compartiendo. Es feo, pero te están mirando.
              </p>
              <div class="barrio-choices">
                <button type="button">Contestar con una tiraera</button>
                <button type="button">Ignorarlo y seguir soltando música</button>
                <button type="button">Reírte y hacer un meme con eso</button>
              </div>
            </div>

            <p class="stage-label">Cabecera de partida</p>
            <div class="sample barrio-strip">
              <div class="top"><span>Año 4 · 25 años</span><span class="barrio-stars">&#9733;&#9733;&#189;</span></div>
              <div class="reads">
                <div><span>dinero</span><b>$$</b></div>
                <div><span>nombre</span><b>Suena</b></div>
                <div><span>ciudad</span><b>Medellín</b></div>
              </div>
              <div class="barrio-rows">
                <div><span>22 · San Juan</span><span>&mdash;</span></div>
                <div><span>23 · Medellín</span><span class="barrio-stars">&#9733;&#9733;</span></div>
                <div><span>24 · Medellín</span><i>&#127915; 12k · &#127942; 1</i></div>
              </div>
            </div>

            <p class="stage-label">Legado final</p>
            <div class="sample barrio-verdict">
              <span class="heart">&#9829;</span>
              <p class="eyebrow">cómo se te va a recordar</p>
              <h3>El Rey del Perreo</h3>
              <p class="epi">“No hubo tarima ni fiesta que no fuera tuya.”</p>
              <span class="legado">Legado 68/100</span>
            </div>

            <div class="sample barrio-logro">¡nuevo logro! <b>Disco de platino</b></div>
          </div>
        </div>
      </section>

      <!-- ====================== 04 · EXPEDIENTE ====================== -->
      <section id="expediente" class="direction dir-expediente">
        <div class="wrap">
          <div class="spec">
            <p class="spec-kicker">Dirección 04</p>
            <h2 class="spec-name">Expediente</h2>
            <p class="spec-concept">
              Dosier de A&amp;R / retrospectiva de revista musical. Negro, crema y oro; serif de
              contraste alto, filetes, capitulares. Eleva el lado narrativo.
            </p>
            <dl class="spec-meta">
              <div>
                <dt>Paleta</dt>
                <dd class="swatches">
                  <span class="swatch"><i style="background: #161310"></i>#161310</span>
                  <span class="swatch"><i style="background: #f6f1e6"></i>#F6F1E6</span>
                  <span class="swatch"><i style="background: #b08636"></i>#B08636</span>
                  <span class="swatch"><i style="background: #e9cf8f"></i>#E9CF8F</span>
                </dd>
              </div>
              <div>
                <dt>Tipografía</dt>
                <dd>Bodoni Moda (títulos y bastardilla) · Archivo (texto y etiquetas)</dd>
              </div>
              <div>
                <dt>Textura</dt>
                <dd>Filetes finos, dobles marcos, capitulares, sellos “certificado”, márgenes generosos.</dd>
              </div>
              <div>
                <dt>Ideal para</dt>
                <dd>Prestigio y peso narrativo. Envejece bien. Menos “juego” que las otras tres.</dd>
              </div>
            </dl>
          </div>

          <div class="stage">
            <p class="stage-label">Logotipo</p>
            <div class="sample exp-wm">
              <div class="rule"></div>
              <div class="big">REGGAETONERO</div>
              <div class="sub">Un expediente de carrera</div>
            </div>

            <p class="stage-label">Una decisión</p>
            <div class="sample exp-card">
              <div class="kick"><span>Año 4 — Entrada 011</span><span class="risk">Riesgo: medio</span></div>
              <h3>Tu primer hater de verdad</h3>
              <p>
                Alguien con más seguidores que tú se puso a bajarte en los comentarios y la gente lo
                está compartiendo. Es feo, pero te están mirando.
              </p>
              <div class="exp-choices">
                <button type="button"><span class="m">A</span> Contestar con una tiraera</button>
                <button type="button"><span class="m">B</span> Ignorarlo y seguir soltando música</button>
                <button type="button"><span class="m">C</span> Reírte y hacer un meme con eso</button>
              </div>
            </div>

            <p class="stage-label">Cabecera de partida</p>
            <div class="sample exp-strip">
              <div class="top"><span>Año 4 · 25 años</span><span class="exp-stars">&#9733;&#9733;&#189;</span></div>
              <div class="reads">
                <div><span>Dinero</span><b>$$</b></div>
                <div><span>Nombre</span><b>Suena</b></div>
                <div><span>Ciudad</span><b>Medellín</b></div>
              </div>
              <div class="exp-rows">
                <div><span>22 · San Juan</span><span>&mdash;</span></div>
                <div><span>23 · Medellín</span><span class="exp-stars">&#9733;&#9733;</span></div>
                <div><span>24 · Medellín</span><i>&#127915; 12k · &#127942; 1</i></div>
              </div>
            </div>

            <p class="stage-label">Legado final</p>
            <div class="sample exp-verdict">
              <p class="eyebrow">Cómo se te va a recordar</p>
              <h3>EL REY DEL PERREO</h3>
              <p class="epi">“No hubo tarima ni fiesta que no fuera tuya.”</p>
              <p class="legado">Legado &nbsp;68 / 100</p>
              <span class="seal">CERTI&shy;FICADO</span>
            </div>

            <div class="sample exp-logro">Nuevo logro <b>Disco de platino</b></div>
          </div>
        </div>
      </section>
    </main>

    <footer class="wrap">
      <p>
        Maquetas estáticas — texto real del juego (evento <code>comeup_primer_hater</code>, veredicto
        <code>el_rey_del_perreo</code>). Tipografías vía Google Fonts. En la implementación real irían
        auto-alojadas. Página temporal — se elimina en cuanto se elija una dirección.
      </p>
    </footer>
  </div>
</template>

<style>
/* Everything is scoped under `.design-page` so nothing leaks into the app. */

.design-page {
  --ground: #f6f7f9;
  --raised: #ffffff;
  --ink: #14171c;
  --ink-soft: #444b55;
  --ink-faint: #8b93a0;
  --line: #e3e6eb;
  --line-strong: #cdd2da;
  --pin: #2f5fd0;
  --pin-soft: #eaf0fd;
  --shadow: 0 1px 2px rgba(20, 23, 28, 0.04), 0 8px 24px -12px rgba(20, 23, 28, 0.12);

  min-height: 100vh;
  background: var(--ground);
  color: var(--ink);
  font-family: 'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  scroll-behavior: smooth;
}

@media (prefers-color-scheme: dark) {
  .design-page {
    --ground: #0f1114;
    --raised: #16191e;
    --ink: #e7e9ed;
    --ink-soft: #a8afba;
    --ink-faint: #6b7280;
    --line: #262b32;
    --line-strong: #333a43;
    --pin: #6f9bff;
    --pin-soft: #1a2333;
    --shadow: 0 1px 2px rgba(0, 0, 0, 0.3), 0 12px 30px -14px rgba(0, 0, 0, 0.55);
  }
}
@media (prefers-reduced-motion: reduce) {
  .design-page { scroll-behavior: auto; }
}

.design-page *,
.design-page *::before,
.design-page *::after { box-sizing: border-box; }

.design-page ::selection { background: var(--pin); color: #fff; }
.design-page a { color: inherit; }
.design-page :focus-visible { outline: 2px solid var(--pin); outline-offset: 3px; border-radius: 2px; }

.design-page .wrap { max-width: 1120px; margin: 0 auto; padding: 0 24px; }

/* ---------- masthead ---------- */
.design-page .mast { padding: 72px 0 40px; }
.design-page .kicker {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: 12px; font-weight: 500;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-faint);
  margin: 0 0 22px;
}
.design-page .mast h1 {
  font-size: clamp(2.4rem, 6vw, 4rem);
  line-height: 1.02; font-weight: 700; letter-spacing: -0.02em;
  text-wrap: balance; margin: 0 0 24px; max-width: 15ch;
}
.design-page .standfirst {
  font-size: clamp(1.05rem, 2.2vw, 1.3rem); line-height: 1.55;
  color: var(--ink-soft); max-width: 62ch; margin: 0;
}

/* ---------- recommendation ---------- */
.design-page .rec {
  margin: 44px 0 12px;
  border: 1px solid var(--line); border-radius: 14px;
  background: var(--raised); box-shadow: var(--shadow); overflow: hidden;
}
.design-page .rec-head {
  display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap;
  padding: 20px 24px; border-bottom: 1px solid var(--line);
}
.design-page .rec-head h2 { margin: 0; font-size: 1.05rem; font-weight: 600; letter-spacing: -0.01em; }
.design-page .rec-head span {
  font-family: 'IBM Plex Mono', monospace; font-size: 11px;
  letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-faint);
}
.design-page .rec ol { margin: 0; padding: 8px 0; list-style: none; counter-reset: r; }
.design-page .rec li {
  display: grid; grid-template-columns: 40px 1fr; gap: 4px 16px;
  padding: 16px 24px; align-items: start; counter-increment: r;
}
.design-page .rec li + li { border-top: 1px solid var(--line); }
.design-page .rec li::before {
  content: counter(r);
  font-family: 'IBM Plex Mono', monospace; font-weight: 500; font-size: 13px;
  color: var(--ink-faint); grid-row: span 2; padding-top: 2px;
}
.design-page .rec li b { font-weight: 600; }
.design-page .rec li .tag {
  display: inline-block; margin-left: 10px;
  font-family: 'IBM Plex Mono', monospace; font-size: 10px;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 2px 7px; border-radius: 999px;
  background: var(--pin-soft); color: var(--pin); vertical-align: 2px;
}
.design-page .rec li p { margin: 0; color: var(--ink-soft); font-size: 0.95rem; grid-column: 2; }

.design-page .howto {
  margin: 22px 0 0; font-size: 0.9rem; color: var(--ink-faint);
  display: flex; gap: 10px; align-items: baseline;
}
.design-page .howto svg { flex: none; }

/* ---------- sticky nav ---------- */
.design-page nav.jump {
  position: sticky; top: 0; z-index: 20;
  background: color-mix(in srgb, var(--ground) 88%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--line);
}
.design-page nav.jump ul {
  max-width: 1120px; margin: 0 auto; padding: 12px 24px;
  display: flex; gap: 8px; flex-wrap: wrap; list-style: none;
}
.design-page nav.jump a {
  text-decoration: none;
  font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.04em;
  padding: 6px 12px; border-radius: 999px;
  border: 1px solid var(--line-strong); color: var(--ink-soft);
  transition: border-color 0.15s, color 0.15s;
}
.design-page nav.jump a:hover { border-color: var(--pin); color: var(--pin); }
.design-page nav.jump a b { color: var(--ink); font-weight: 600; }

/* ---------- direction layout ---------- */
.design-page .direction {
  padding: 64px 0; border-bottom: 1px solid var(--line); scroll-margin-top: 60px;
}
.design-page .direction > .wrap { display: grid; grid-template-columns: 1fr; gap: 40px; }
@media (min-width: 940px) {
  .design-page .direction > .wrap {
    grid-template-columns: 320px 1fr; gap: 56px; align-items: start;
  }
  .design-page .spec { position: sticky; top: 70px; }
}

.design-page .spec-kicker {
  font-family: 'IBM Plex Mono', monospace; font-size: 12px;
  letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-faint); margin: 0 0 14px;
}
.design-page .spec-name { margin: 0 0 14px; line-height: 0.95; font-weight: 400; }
.design-page .spec-concept { margin: 0 0 28px; color: var(--ink-soft); font-size: 1.02rem; }
.design-page .spec-meta { margin: 0; display: grid; gap: 18px; }
.design-page .spec-meta > div { display: grid; gap: 7px; }
.design-page .spec-meta dt {
  font-family: 'IBM Plex Mono', monospace; font-size: 10.5px;
  letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-faint);
}
.design-page .spec-meta dd { margin: 0; font-size: 0.92rem; color: var(--ink-soft); }

.design-page .swatches { display: flex; flex-wrap: wrap; gap: 6px; }
.design-page .swatch {
  display: flex; align-items: center; gap: 7px;
  font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: var(--ink-soft);
  border: 1px solid var(--line); border-radius: 6px; padding: 4px 8px 4px 5px;
  font-variant-numeric: tabular-nums;
}
.design-page .swatch i { width: 13px; height: 13px; border-radius: 3px; flex: none; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12); }

/* ---------- phone-width stage ---------- */
.design-page .stage {
  max-width: 390px; margin-inline: auto; width: 100%;
  display: grid; gap: 20px; padding: 26px;
  border-radius: 20px; border: 1px solid var(--line); box-shadow: var(--shadow);
}
@media (min-width: 940px) { .design-page .stage { margin-inline: 0; } }
.design-page .stage-label {
  font-family: 'IBM Plex Mono', monospace; font-size: 10px;
  letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.55; margin: -4px 0 -6px;
}

.design-page footer { padding: 44px 0 80px; color: var(--ink-faint); font-size: 0.85rem; }
.design-page footer p { margin: 0; max-width: 72ch; }
.design-page footer code { font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; }

/* ==================================================================== */
/* ===================  DIRECTION 1 — CARTEL  ========================== */
.design-page #cartel .spec-name {
  font-family: 'Anton', sans-serif; font-size: 3.6rem; letter-spacing: 0.01em;
  text-transform: uppercase; color: var(--ink);
}
.design-page .dir-cartel .stage {
  background:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E"),
    #f1ece0;
  background-blend-mode: multiply;
  border-color: #16130f; border-width: 2px;
  box-shadow: 8px 8px 0 #16130f; color: #16130f;
  font-family: 'Archivo', sans-serif;
}
.design-page .dir-cartel .stage-label { color: #16130f; }
.design-page .cartel-wm { text-align: center; padding: 6px 0 2px; }
.design-page .cartel-wm .big {
  font-family: 'Anton', sans-serif; text-transform: uppercase;
  font-size: clamp(2.6rem, 12vw, 3.5rem); line-height: 0.84; letter-spacing: 0.005em;
  color: #cc2b1d; text-shadow: 3px 3px 0 #16130f;
}
.design-page .cartel-wm .sub {
  margin-top: 12px; font-weight: 700; font-size: 10px;
  letter-spacing: 0.22em; text-transform: uppercase;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.design-page .cartel-wm .sub::before,
.design-page .cartel-wm .sub::after { content: ''; height: 2px; width: 26px; background: #16130f; }
.design-page .cartel-card { background: #fbf9f3; border: 2px solid #16130f; position: relative; }
.design-page .cartel-card::before {
  content: ''; position: absolute; top: -11px; left: 50%; width: 88px; height: 20px;
  transform: translateX(-50%) rotate(-2deg);
  background: rgba(201, 154, 58, 0.55); border: 1px solid rgba(22, 19, 15, 0.3);
}
.design-page .cartel-card .hd {
  background: #16130f; color: #f1ece0;
  display: flex; justify-content: space-between; align-items: center; gap: 10px;
  padding: 9px 12px; font-weight: 700; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
}
.design-page .cartel-card .risk { background: #cc2b1d; color: #fff; padding: 3px 8px; letter-spacing: 0.12em; }
.design-page .cartel-card .bd { padding: 16px 16px 18px; }
.design-page .cartel-card h3 {
  font-family: 'Anton', sans-serif; text-transform: uppercase;
  font-size: 1.7rem; line-height: 0.95; letter-spacing: 0.01em;
  margin: 0 0 10px; color: #16130f; text-wrap: balance;
}
.design-page .cartel-card p { margin: 0 0 16px; font-size: 0.82rem; line-height: 1.5; color: #38332b; }
.design-page .cartel-choices { display: grid; gap: 8px; }
.design-page .cartel-choices button {
  font: inherit; text-align: left; cursor: pointer;
  background: #fbf9f3; border: 2px solid #16130f; color: #16130f;
  padding: 10px 12px; font-weight: 600; font-size: 0.82rem;
  display: flex; gap: 9px; align-items: center;
  transition: background 0.12s, color 0.12s;
}
.design-page .cartel-choices button::before { content: '\25B8'; color: #cc2b1d; font-size: 0.9em; }
.design-page .cartel-choices button:hover { background: #16130f; color: #fbf9f3; }
.design-page .cartel-choices button:hover::before { color: #c99a3a; }
.design-page .cartel-strip { border: 2px solid #16130f; background: #fbf9f3; }
.design-page .cartel-strip .top {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 12px; border-bottom: 2px solid #16130f;
  font-weight: 700; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
}
.design-page .cartel-stars { letter-spacing: 2px; color: #c99a3a; font-size: 1rem; }
.design-page .cartel-strip .reads { display: flex; }
.design-page .cartel-strip .reads div {
  flex: 1; padding: 9px 10px; text-align: center; border-right: 1px solid rgba(22, 19, 15, 0.25);
}
.design-page .cartel-strip .reads div:last-child { border-right: 0; }
.design-page .cartel-strip .reads span {
  display: block; font-size: 8.5px; letter-spacing: 0.14em; text-transform: uppercase; color: #7a7266;
}
.design-page .cartel-strip .reads b { font-family: 'Anton', sans-serif; font-size: 1.05rem; letter-spacing: 0.02em; }
.design-page .cartel-rows { font-variant-numeric: tabular-nums; border-top: 2px solid #16130f; }
.design-page .cartel-rows div {
  display: flex; justify-content: space-between; padding: 7px 12px; font-size: 0.78rem; font-weight: 600;
}
.design-page .cartel-rows div + div { border-top: 1px solid rgba(22, 19, 15, 0.2); }
.design-page .cartel-rows i { color: #c99a3a; font-style: normal; }
.design-page .cartel-verdict {
  background: #16130f; color: #f1ece0; padding: 26px 20px 22px; text-align: center; position: relative;
  background-image: radial-gradient(circle, rgba(241, 236, 224, 0.14) 1px, transparent 1.3px);
  background-size: 7px 7px;
}
.design-page .cartel-verdict .corner { position: absolute; width: 14px; height: 14px; border: 2px solid #c99a3a; }
.design-page .cartel-verdict .corner.tl { top: 8px; left: 8px; border-right: 0; border-bottom: 0; }
.design-page .cartel-verdict .corner.tr { top: 8px; right: 8px; border-left: 0; border-bottom: 0; }
.design-page .cartel-verdict .corner.bl { bottom: 8px; left: 8px; border-right: 0; border-top: 0; }
.design-page .cartel-verdict .corner.br { bottom: 8px; right: 8px; border-left: 0; border-top: 0; }
.design-page .cartel-verdict .eyebrow { font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase; color: #c99a3a; }
.design-page .cartel-verdict h3 {
  font-family: 'Anton', sans-serif; text-transform: uppercase;
  font-size: 2.5rem; line-height: 0.82; margin: 12px 0; color: #cc2b1d; text-shadow: 2px 2px 0 #000;
}
.design-page .cartel-verdict .epi { font-size: 0.82rem; font-style: italic; color: #d8d2c4; max-width: 26ch; margin: 0 auto 16px; }
.design-page .cartel-verdict .legado {
  font-weight: 700; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  border-top: 1px solid rgba(201, 154, 58, 0.4); padding-top: 12px;
}
.design-page .cartel-badge {
  position: absolute; right: -6px; bottom: -6px; width: 66px; height: 66px; border-radius: 50%;
  border: 2px solid #c99a3a; color: #c99a3a;
  display: grid; place-content: center; text-align: center;
  font-weight: 800; font-size: 8px; letter-spacing: 0.12em; line-height: 1.15;
  background: #16130f; transform: rotate(-12deg);
}
.design-page .cartel-logro {
  display: flex; align-items: center; gap: 9px; background: #c99a3a; color: #16130f;
  padding: 8px 12px; font-weight: 800; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
}
.design-page .cartel-logro b { font-family: 'Anton', sans-serif; letter-spacing: 0.04em; font-size: 13px; }

/* ==================================================================== */
/* ================  DIRECTION 2 — PERREO 2000  ======================= */
.design-page #perreo .spec-name {
  font-family: 'Syne', sans-serif; font-weight: 800; font-size: 3.1rem; letter-spacing: -0.02em;
  background: linear-gradient(180deg, #9aa1b4 0%, #f4f6fb 44%, #7f8798 58%, #c9cfdd 100%);
  -webkit-background-clip: text; background-clip: text; color: #b9c0cf; -webkit-text-fill-color: transparent;
}
.design-page .dir-perreo .stage {
  background:
    radial-gradient(120% 70% at 20% 0%, rgba(255, 61, 180, 0.2), transparent 60%),
    radial-gradient(120% 70% at 100% 100%, rgba(55, 224, 255, 0.18), transparent 55%),
    #0d0814;
  border-color: #2a1f3d; color: #cbd0e0; font-family: 'Manrope', sans-serif;
}
.design-page .dir-perreo .stage-label { color: #7a7290; }
.design-page .chrome {
  background: linear-gradient(180deg, #8f97ab 0%, #ffffff 42%, #6f7788 56%, #c2c8d6 100%);
  -webkit-background-clip: text; background-clip: text; color: #c2c8d6; -webkit-text-fill-color: transparent;
}
.design-page .perreo-wm { text-align: center; padding: 10px 0 4px; }
.design-page .perreo-wm .big {
  font-family: 'Syne', sans-serif; font-weight: 800;
  font-size: clamp(1.9rem, 8.4vw, 2.5rem); letter-spacing: -0.03em; line-height: 1;
  filter: drop-shadow(0 2px 10px rgba(255, 61, 180, 0.55));
}
.design-page .perreo-wm .sub {
  margin-top: 12px; font-size: 10px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase;
  color: #37e0ff; text-shadow: 0 0 12px rgba(55, 224, 255, 0.6);
}
.design-page .perreo-card {
  position: relative; border-radius: 20px; padding: 1px;
  background: linear-gradient(135deg, #ff3db4, #37e0ff 55%, #c6ff3d);
}
.design-page .perreo-card > .inner {
  background: rgba(13, 8, 20, 0.86); border-radius: 19px; padding: 18px; backdrop-filter: blur(4px);
}
.design-page .perreo-card .risk {
  display: inline-block; font-size: 9px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase;
  color: #37e0ff; border: 1px solid rgba(55, 224, 255, 0.5); border-radius: 999px;
  padding: 3px 10px; box-shadow: 0 0 14px rgba(55, 224, 255, 0.25) inset; margin-bottom: 12px;
}
.design-page .perreo-card h3 {
  font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.4rem; line-height: 1.08;
  letter-spacing: -0.02em; margin: 0 0 9px; color: #fff; text-wrap: balance;
}
.design-page .perreo-card p { margin: 0 0 15px; font-size: 0.82rem; line-height: 1.55; color: #a6abbf; }
.design-page .perreo-choices { display: grid; gap: 8px; }
.design-page .perreo-choices button {
  font: inherit; cursor: pointer; text-align: left;
  background: rgba(255, 255, 255, 0.045); border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e6e8f0; border-radius: 12px; padding: 11px 13px; font-weight: 600; font-size: 0.82rem;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
}
.design-page .perreo-choices button:hover {
  border-color: #ff3db4; background: rgba(255, 61, 180, 0.08); box-shadow: 0 0 18px rgba(255, 61, 180, 0.28);
}
.design-page .perreo-strip {
  border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03); overflow: hidden;
}
.design-page .perreo-strip .top {
  display: flex; justify-content: space-between; align-items: center;
  padding: 11px 14px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.design-page .perreo-strip .yr { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #7a7290; }
.design-page .perreo-stars { color: #c6ff3d; letter-spacing: 2px; text-shadow: 0 0 10px rgba(198, 255, 61, 0.5); }
.design-page .perreo-strip .reads { display: flex; }
.design-page .perreo-strip .reads div { flex: 1; padding: 10px 8px; text-align: center; }
.design-page .perreo-strip .reads div + div { border-left: 1px solid rgba(255, 255, 255, 0.07); }
.design-page .perreo-strip .reads span {
  display: block; font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: #6f6a85; margin-bottom: 3px;
}
.design-page .perreo-strip .reads b { font-weight: 800; font-size: 0.92rem; }
.design-page .perreo-rows { font-variant-numeric: tabular-nums; }
.design-page .perreo-rows div { display: flex; justify-content: space-between; padding: 8px 14px; font-size: 0.78rem; }
.design-page .perreo-rows div + div { border-top: 1px solid rgba(255, 255, 255, 0.06); }
.design-page .perreo-rows i { font-style: normal; color: #c6ff3d; }
.design-page .perreo-verdict {
  position: relative; border-radius: 20px; padding: 28px 20px 22px; text-align: center; overflow: hidden;
  background: radial-gradient(90% 120% at 50% -10%, rgba(255, 61, 180, 0.35), transparent 62%), #0a0611;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.design-page .perreo-verdict .eyebrow { font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase; color: #37e0ff; }
.design-page .perreo-verdict h3 {
  font-family: 'Syne', sans-serif; font-weight: 800; font-size: 2rem; letter-spacing: -0.03em;
  line-height: 0.95; margin: 12px 0 14px; filter: drop-shadow(0 3px 16px rgba(255, 61, 180, 0.5));
}
.design-page .perreo-verdict .epi { font-size: 0.82rem; color: #b6bacb; font-style: italic; max-width: 26ch; margin: 0 auto 16px; }
.design-page .perreo-verdict .legado {
  font-weight: 800; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #c6ff3d;
  border-top: 1px solid rgba(255, 255, 255, 0.12); padding-top: 12px;
}
.design-page .perreo-verdict .spark {
  position: absolute; width: 4px; height: 4px; border-radius: 50%; background: #fff;
  box-shadow: 0 0 8px 2px rgba(255, 255, 255, 0.8);
}
.design-page .perreo-verdict .spark:nth-child(1) { top: 20%; left: 14%; }
.design-page .perreo-verdict .spark:nth-child(2) { top: 62%; right: 12%; background: #37e0ff; box-shadow: 0 0 8px 2px rgba(55, 224, 255, 0.8); }
.design-page .perreo-verdict .spark:nth-child(3) { bottom: 16%; left: 22%; background: #ff3db4; box-shadow: 0 0 8px 2px rgba(255, 61, 180, 0.8); }
.design-page .perreo-logro {
  display: flex; align-items: center; gap: 10px; border-radius: 12px; padding: 10px 13px;
  font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #0d0814;
  background: linear-gradient(90deg, #ff3db4, #c6ff3d);
}
.design-page .perreo-logro b { font-family: 'Syne', sans-serif; font-size: 12px; letter-spacing: -0.01em; }

/* ==================================================================== */
/* ==================  DIRECTION 3 — BARRIO  ========================== */
.design-page #barrio .spec-name {
  font-family: 'Shrikhand', serif; font-size: 2.9rem; color: #ff2d7e; text-shadow: 2.5px 2.5px 0 #2f4bd8;
}
.design-page .dir-barrio .stage {
  background:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)' opacity='0.6'/%3E%3C/svg%3E"),
    #efe7d6;
  background-blend-mode: multiply;
  border-color: #241c15; border-radius: 22px; color: #241c15; font-family: 'Nunito', sans-serif;
}
.design-page .dir-barrio .stage-label { color: #7a6f5c; }
.design-page .barrio-wm { text-align: center; padding: 8px 0 2px; }
.design-page .barrio-wm .big {
  font-family: 'Shrikhand', serif; color: #ff2d7e;
  font-size: clamp(1.9rem, 9vw, 2.6rem); line-height: 0.95;
  text-shadow: 3px 3px 0 #2f4bd8; transform: rotate(-2deg);
}
.design-page .barrio-wm .swoosh {
  height: 10px; width: 180px; margin: 6px auto 0; background: #ffb32e;
  border-radius: 40% 60% 55% 45% / 60%; transform: rotate(-1.5deg);
}
.design-page .barrio-wm .sub { margin-top: 10px; font-family: 'Caveat', cursive; font-size: 1.15rem; color: #2f4bd8; }
.design-page .barrio-card {
  background: #fbf6ea; border: 2.5px solid #241c15;
  border-radius: 14px 18px 12px 20px; padding: 16px; position: relative;
}
.design-page .barrio-card .risk {
  position: absolute; top: -12px; right: 12px;
  background: #ffb32e; border: 2px solid #241c15; border-radius: 8px;
  font-family: 'Caveat', cursive; font-weight: 700; font-size: 0.95rem;
  padding: 0 9px; transform: rotate(3deg);
}
.design-page .barrio-card h3 {
  font-family: 'Shrikhand', serif; color: #ff2d7e; font-size: 1.35rem; line-height: 1.05;
  margin: 2px 0 4px; font-weight: 400; text-shadow: 1.5px 1.5px 0 #2f4bd8;
}
.design-page .barrio-card .u {
  height: 8px; background: rgba(255, 179, 46, 0.7); width: 70%; margin: 0 0 11px;
  border-radius: 6px; transform: rotate(-0.6deg);
}
.design-page .barrio-card p { margin: 0 0 14px; font-size: 0.84rem; line-height: 1.5; color: #3f362b; font-weight: 500; }
.design-page .barrio-choices { display: grid; gap: 9px; }
.design-page .barrio-choices button {
  font: inherit; cursor: pointer; text-align: left; font-weight: 700; font-size: 0.82rem;
  border: 2px solid #241c15; border-radius: 10px; padding: 9px 12px;
  background: #fff; color: #241c15; transition: transform 0.12s, background 0.12s;
}
.design-page .barrio-choices button:nth-child(1) { transform: rotate(-0.7deg); }
.design-page .barrio-choices button:nth-child(2) { transform: rotate(0.5deg); }
.design-page .barrio-choices button:nth-child(3) { transform: rotate(-0.3deg); }
.design-page .barrio-choices button:nth-child(1):hover { background: #ffe1ec; }
.design-page .barrio-choices button:nth-child(2):hover { background: #e2e7fb; }
.design-page .barrio-choices button:nth-child(3):hover { background: #fff0d6; }
.design-page .barrio-choices button:hover { transform: rotate(0) scale(1.015); }
.design-page .barrio-strip { background: #fbf6ea; border: 2.5px solid #241c15; border-radius: 14px; overflow: hidden; }
.design-page .barrio-strip .top {
  display: flex; justify-content: space-between; align-items: center; padding: 9px 13px;
  border-bottom: 2.5px dashed #241c15; font-family: 'Caveat', cursive; font-size: 1.05rem; font-weight: 700;
}
.design-page .barrio-stars { color: #ff2d7e; letter-spacing: 1px; -webkit-text-stroke: 1px #241c15; font-family: 'Nunito', sans-serif; }
.design-page .barrio-strip .reads { display: flex; }
.design-page .barrio-strip .reads div { flex: 1; text-align: center; padding: 9px 6px; }
.design-page .barrio-strip .reads div + div { border-left: 2px dotted rgba(36, 28, 21, 0.4); }
.design-page .barrio-strip .reads span { display: block; font-family: 'Caveat', cursive; font-size: 0.9rem; color: #7a6f5c; }
.design-page .barrio-strip .reads b { font-weight: 900; font-size: 0.95rem; }
.design-page .barrio-rows { font-variant-numeric: tabular-nums; }
.design-page .barrio-rows div { display: flex; justify-content: space-between; padding: 7px 13px; font-size: 0.8rem; font-weight: 700; }
.design-page .barrio-rows div + div { border-top: 1.5px dotted rgba(36, 28, 21, 0.35); }
.design-page .barrio-rows i { font-style: normal; color: #2f4bd8; }
.design-page .barrio-verdict {
  background: #ff2d7e; color: #fff; border: 2.5px solid #241c15; border-radius: 16px;
  padding: 24px 18px 20px; text-align: center; position: relative;
}
.design-page .barrio-verdict .eyebrow { font-family: 'Caveat', cursive; font-size: 1.05rem; color: #ffd9e7; }
.design-page .barrio-verdict h3 {
  font-family: 'Shrikhand', serif; font-weight: 400; font-size: 1.9rem; line-height: 0.95;
  margin: 8px 0 12px; color: #fff; text-shadow: 3px 3px 0 #2f4bd8;
}
.design-page .barrio-verdict .epi { font-size: 0.86rem; font-weight: 600; max-width: 24ch; margin: 0 auto 14px; }
.design-page .barrio-verdict .legado {
  display: inline-block; font-family: 'Caveat', cursive; font-size: 1.3rem; font-weight: 700;
  border: 2.5px solid #fff; border-radius: 50% / 60%; padding: 2px 14px; transform: rotate(-2deg);
}
.design-page .barrio-verdict .heart { position: absolute; top: 14px; right: 16px; font-size: 1.3rem; transform: rotate(12deg); }
.design-page .barrio-logro {
  display: flex; align-items: center; gap: 9px; background: #ffb32e; color: #241c15;
  border: 2.5px solid #241c15; border-radius: 10px; padding: 8px 12px;
  font-family: 'Caveat', cursive; font-size: 1.05rem; font-weight: 700; transform: rotate(-1deg);
}
.design-page .barrio-logro b { font-family: 'Shrikhand', serif; font-weight: 400; font-size: 0.95rem; color: #ff2d7e; }

/* ==================================================================== */
/* ================  DIRECTION 4 — EXPEDIENTE  ======================== */
.design-page #expediente .spec-name {
  font-family: 'Bodoni Moda', serif; font-weight: 900; font-size: 3rem; letter-spacing: 0.01em; color: var(--ink);
}
.design-page .dir-expediente .stage {
  background: #161310; border-color: #b08636; border-radius: 4px;
  color: #d9d3c6; font-family: 'Archivo', sans-serif;
}
.design-page .dir-expediente .stage-label { color: #8a7f68; }
.design-page .exp-wm { text-align: center; padding: 8px 0 4px; border-block: 1px solid rgba(176, 134, 54, 0.4); }
.design-page .exp-wm .rule { height: 1px; background: #b08636; width: 40px; margin: 0 auto 12px; }
.design-page .exp-wm .big {
  font-family: 'Bodoni Moda', serif; font-weight: 400;
  font-size: clamp(1.6rem, 7vw, 2.1rem); letter-spacing: 0.12em; color: #f4efe3;
}
.design-page .exp-wm .sub { margin-top: 10px; font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: #b08636; }
.design-page .exp-card { background: #f6f1e6; color: #1a1712; padding: 20px; border-radius: 2px; }
.design-page .exp-card .kick {
  font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase; color: #8a6a1f;
  padding-bottom: 8px; border-bottom: 1px solid #d8cdae; margin-bottom: 13px;
  display: flex; justify-content: space-between; align-items: center;
}
.design-page .exp-card .kick .risk { color: #1a1712; border: 1px solid #b08636; padding: 2px 7px; letter-spacing: 0.16em; }
.design-page .exp-card h3 {
  font-family: 'Bodoni Moda', serif; font-weight: 700; font-size: 1.5rem; line-height: 1.12;
  margin: 0 0 10px; text-wrap: balance;
}
.design-page .exp-card p { margin: 0 0 16px; font-size: 0.84rem; line-height: 1.6; color: #443d31; }
.design-page .exp-choices { display: grid; }
.design-page .exp-choices button {
  font: inherit; cursor: pointer; text-align: left; background: none; border: 0;
  border-top: 1px solid #d8cdae; padding: 12px 2px; color: #1a1712;
  display: flex; gap: 12px; align-items: baseline; font-size: 0.86rem;
  transition: color 0.12s, padding-left 0.12s;
}
.design-page .exp-choices button:last-child { border-bottom: 1px solid #d8cdae; }
.design-page .exp-choices button .m {
  font-family: 'Bodoni Moda', serif; font-style: italic; font-weight: 500; color: #8a6a1f; font-size: 1rem; flex: none;
}
.design-page .exp-choices button:hover { color: #8a6a1f; padding-left: 6px; }
.design-page .exp-strip { border: 1px solid rgba(176, 134, 54, 0.45); border-radius: 2px; }
.design-page .exp-strip .top {
  display: flex; justify-content: space-between; align-items: center; padding: 10px 14px;
  border-bottom: 1px solid rgba(176, 134, 54, 0.35);
  font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #8a7f68;
}
.design-page .exp-stars { color: #b08636; letter-spacing: 3px; }
.design-page .exp-strip .reads { display: flex; }
.design-page .exp-strip .reads div { flex: 1; padding: 11px 8px; text-align: center; }
.design-page .exp-strip .reads div + div { border-left: 1px solid rgba(176, 134, 54, 0.25); }
.design-page .exp-strip .reads span {
  display: block; font-size: 8px; letter-spacing: 0.16em; text-transform: uppercase; color: #7a7160; margin-bottom: 4px;
}
.design-page .exp-strip .reads b { font-family: 'Bodoni Moda', serif; font-weight: 700; font-size: 1rem; color: #f4efe3; }
.design-page .exp-rows { font-variant-numeric: tabular-nums; }
.design-page .exp-rows div { display: flex; justify-content: space-between; padding: 9px 14px; font-size: 0.78rem; color: #cfc8b8; }
.design-page .exp-rows div + div { border-top: 1px solid rgba(176, 134, 54, 0.18); }
.design-page .exp-rows i { font-style: normal; color: #b08636; }
.design-page .exp-verdict {
  background: #161310; border: 1px solid #b08636; border-radius: 2px;
  padding: 26px 22px; text-align: center; position: relative;
  box-shadow: inset 0 0 0 4px #161310, inset 0 0 0 5px rgba(176, 134, 54, 0.4);
}
.design-page .exp-verdict .eyebrow { font-size: 8px; letter-spacing: 0.3em; text-transform: uppercase; color: #8a7f68; }
.design-page .exp-verdict h3 {
  font-family: 'Bodoni Moda', serif; font-weight: 900; font-size: 1.85rem; line-height: 1.05;
  letter-spacing: 0.02em; margin: 14px 0 12px;
  background: linear-gradient(180deg, #e9cf8f, #b08636 60%, #8a6a1f);
  -webkit-background-clip: text; background-clip: text; color: #b08636; -webkit-text-fill-color: transparent;
}
.design-page .exp-verdict .epi {
  font-family: 'Bodoni Moda', serif; font-style: italic; font-size: 0.95rem; color: #d9d3c6;
  max-width: 26ch; margin: 0 auto 18px;
}
.design-page .exp-verdict .legado {
  font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: #cfc8b8;
  border-top: 1px solid rgba(176, 134, 54, 0.4); padding-top: 13px;
}
.design-page .exp-verdict .seal {
  position: absolute; right: 14px; bottom: 14px; width: 52px; height: 52px; border-radius: 50%;
  border: 1px solid #b08636; color: #b08636;
  display: grid; place-content: center; font-size: 7px; letter-spacing: 0.1em; text-align: center; line-height: 1.2;
}
.design-page .exp-logro {
  display: flex; align-items: center; gap: 10px; border: 1px solid rgba(176, 134, 54, 0.5); border-radius: 2px;
  padding: 9px 13px; font-size: 8.5px; letter-spacing: 0.22em; text-transform: uppercase; color: #8a7f68;
}
.design-page .exp-logro b {
  font-family: 'Bodoni Moda', serif; letter-spacing: 0.04em; font-size: 12px; color: #e9cf8f; text-transform: none;
}
</style>
