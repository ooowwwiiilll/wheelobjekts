import React, { useEffect, useState } from "react";
import "./heartbeat.css";

/* Header waveform — generated from the same decay curve the app's own
   WaveformView draws: exponential decay, sqrt display curve, floored tail. */
function Wave() {
    const N = 130, X0 = 7, X1 = 513, MID = 26, MAXH = 23;
    const span = (X1 - X0) / N;
    const bw = span * 0.62;
    const bars = [];
    for (let i = 0; i < N; i++) {
        const t = i / (N - 1);
        const decay = Math.exp(-4.2 * t);
        const wobble = 0.62 + 0.38 * Math.abs(Math.sin(t * 26)) * Math.exp(-1.6 * t);
        const h = Math.max(0.9, MAXH * Math.sqrt(decay * wobble));
        bars.push(
            <rect key={i} x={(X0 + i * span).toFixed(1)} y={(MID - h).toFixed(1)}
                width={bw.toFixed(2)} height={(2 * h).toFixed(1)} rx={Math.min(bw / 2, 1.2).toFixed(2)} />
        );
    }
    return (
        <svg className="hb-wave" viewBox="0 0 520 52" role="img" aria-label="Decaying waveform envelope">
            <title>Decaying waveform envelope</title>
            <g fill="currentColor">{bars}</g>
        </svg>
    );
}

/* A reference image. Hides itself entirely if the file isn't present yet. */
function Fig({ src, alt, caption }) {
    const [ok, setOk] = useState(true);
    if (!ok) return null;
    return (
        <figure className="hb-fig">
            <img src={src} alt={alt} loading="lazy" onError={() => setOk(false)} />
            <figcaption>{caption}</figcaption>
        </figure>
    );
}

/* Verbatim, as said in the brief. Kept unedited on purpose. */
function Said({ children, who = "Will, in the brief" }) {
    return (
        <blockquote className="hb-said">
            <p>{children}</p>
            <cite>{who}</cite>
        </blockquote>
    );
}

function Rule({ n, children }) {
    return (
        <div className="hb-rule">
            <span className="hb-tag">{n}</span>
            <h2>{children}</h2>
        </div>
    );
}

export default function HeartbeatApp() {
    useEffect(() => {
        document.title = "hrtbt — build spec";
    }, []);

    return (
        <div className="hb">
            <div className="hb-wrap">

                <header className="hb-head">
                    <h1 className="hb-mark">hrtbt</h1>
                    <Wave />
                    <p className="hb-standfirst">
                        Every run becomes its own track, composed from your heartbeat.
                    </p>
                    <div className="hb-meta">
                        <span>Build spec v1</span>
                        <span>iOS 17+ / SwiftUI</span>
                        <span>1,454 lines scaffolded</span>
                        <span>Composer verified</span>
                    </div>
                </header>

                {/* ── 01 ─────────────────────────────────────────────── */}
                <section>
                    <Rule n="01">The idea</Rule>

                    <Said who="Will — screen 2 copy">
                        every fitness training activity is different. some felt easy, some felt more
                        challenging than usual. what if you&rsquo;re able to create &amp; listen tunes that
                        reflects each activity&rsquo;s unique effort &amp; feeling?
                    </Said>

                    <p className="hb-lead">
                        You finish a run. The app turns that specific run into a two-minute piece of minimal
                        house. Not a preset with your name on it, and not a generic workout playlist. The
                        tempo, the density, the texture and the arc all come from what your body actually did
                        for those thirty minutes.
                    </p>

                    <p>
                        Two runs of the same distance at the same average heart rate produce measurably
                        different tracks, because a steady tempo run and an interval session are different
                        shapes even when they average out the same.
                    </p>

                    <h3>Why breakbeat and house, specifically</h3>
                    <p>
                        Running heart rate sits between 140 and 190 beats per minute. Jungle, breakbeat and
                        drum and bass sit in exactly that tempo range. Running cadence sits around 170 to 185
                        steps per minute, which is also musical tempo. The pun in the product name is a real
                        technical coincidence, and it is why this genre and not another.
                    </p>

                    <h3>The target sound</h3>
                    <Said>
                        the output music will not sound as immersive as other edms producer, but generally
                        more sounds like minimal house by four tet.
                    </Said>
                    <p>
                        That is a deliberate and achievable target. It also sets the bar for what
                        &ldquo;good&rdquo; means here: restraint, space and texture rather than density and
                        polish.
                    </p>

                    <h3>The positioning</h3>
                    <Said>
                        YES that&rsquo;s the word i was thinking of&ndash; RESAMPLING like daft punk!
                        that&rsquo;s basically what i was thinking of.
                    </Said>

                    <p>
                        Daft Punk built <em>Discovery</em> by chopping fragments out of other people&rsquo;s
                        records and recombining them into something coherent. The reference point here is that
                        practice, with one substitution: <strong>the crate you dig through is your own run.</strong>
                    </p>

                    <Fig
                        src="/heartbeat/tracklib.png"
                        alt="Tracklib sample breakdown, showing stacked waveform lanes with highlighted source fragments"
                        caption="Reference: a sample breakdown. Stacked lanes, each highlighting the fragment that was lifted and where it landed."
                    />

                    <p>
                        That substitution has a direct consequence for the product, and it is the single most
                        important design idea in this document. The music detail page should not be a player
                        with a paragraph of text under it. It should be a <strong>sample breakdown</strong>:
                        stacked waveform lanes, each layer highlighted against the moment in the run that
                        produced it. Tap a lane and it tells you the fill came from kilometre seven, where your
                        heart rate peaked at 182.
                    </p>

                    <div className="hb-note">
                        <span className="h">One honest caveat</span>
                        <p>
                            Daft Punk&rsquo;s cohesion comes partly from source material that was already a
                            single recording, so the room, the tape and the compression matched for free. These
                            samples come from unrelated sources, so that glue has to be manufactured
                            deliberately. Section 06 covers how.
                        </p>
                    </div>
                </section>

                {/* ── 02 ─────────────────────────────────────────────── */}
                <section>
                    <Rule n="02">User flow</Rule>

                    <Fig
                        src="/heartbeat/flow.png"
                        alt="Seven-screen wireframe flow for hrtbt, from connect through library to track detail"
                        caption="The original flow. Screens 1–5 onboarding, 6 the library, 7 the track."
                    />

                    <p>Seven screens. One through five are onboarding, six is the library, seven is the track.</p>

                    <div className="hb-screens">
                        <div className="hb-screen"><span className="i">01</span><p className="t">Connect</p><p className="d">Apple Health or Strava. Nike Run Club is not available and should not be offered.</p></div>
                        <div className="hb-screen"><span className="i">02</span><p className="t">Premise</p><p className="d">Every training session feels different. What if you could hear that difference?</p></div>
                        <div className="hb-screen"><span className="i">03</span><p className="t">Pick a genre</p><p className="d">Four banks, each pitched at a reference artist. Changeable later in settings.</p></div>
                        <div className="hb-screen"><span className="i">04</span><p className="t">Pick five samples</p><p className="d">Nine waveforms shown, tap to audition, one plays at a time. A modal opens the full bank.</p></div>
                        <div className="hb-screen"><span className="i">05</span><p className="t">How it works</p><p className="d">Samples are hand-picked, sequences are human-arranged. See the legal note in section 11.</p></div>
                        <div className="hb-screen"><span className="i">06</span><p className="t">Library</p><p className="d">Last ten activities, newest first. Load ten more on demand. Generate per activity.</p></div>
                        <div className="hb-screen"><span className="i">07</span><p className="t">Track</p><p className="d">Playback plus the sample breakdown. Background audio and lock screen controls.</p></div>
                    </div>

                    <h4>Rules the flow depends on</h4>
                    <ul>
                        <li><strong>Tracks are not generated automatically.</strong> An activity appears in the library with a Generate button. Nothing is composed until the user asks, because they may still change genre or samples.</li>
                        <li><strong>An activity only gets a detail page once it has a track.</strong> Before generation there is nothing to play and nothing to break down.</li>
                        <li><strong>Fetching is incremental.</strong> On launch, pull anything new and append. The initial backfill is ten activities, with a control to pull ten more.</li>
                        <li><strong>Regeneration is allowed.</strong> Same activity, different result, by design.</li>
                    </ul>

                    <Said>
                        user MIGHT can generate another beat from same activity, but i will think of the
                        different &ldquo;processing&rdquo; of arrangement so no same results.
                    </Said>
                    <p>
                        Solved by seeding. Section 07 explains how the same run yields a different but still
                        fully reproducible track.
                    </p>
                </section>

                {/* ── 03 ─────────────────────────────────────────────── */}
                <section>
                    <Rule n="03">How the mechanism works</Rule>

                    <div className="hb-note">
                        <span className="h">The idea that makes this tractable</span>
                        <p>
                            Generating music here is not the app playing instruments in real time. It is
                            <strong> pasting short sounds into a long silent recording at specific timestamps</strong>,
                            then saving the result. Nothing plays live. The app builds a file, then plays the file.
                        </p>
                    </div>

                    <div className="hb-stages">
                        <div className="hb-stage"><span className="n">01</span><div><p className="t">Fetch</p><p className="d">Pull new activities on launch. Per-second streams for heart rate, cadence, velocity and altitude are cached permanently and never refetched.</p></div></div>
                        <div className="hb-stage"><span className="n">02</span><div><p className="t">Reduce</p><p className="d">Boil the run down to roughly ten numbers plus three to eight sections, each with an intensity score. <span className="m">FeatureExtractor</span> does this once. The composer never sees the raw run again.</p></div></div>
                        <div className="hb-stage"><span className="n">03</span><div><p className="t">Compose</p><p className="d">Pure function, no audio. Decide tempo, section count, which layers play, which patterns and samples, then expand every pattern across every bar into individual hits.</p></div></div>
                        <div className="hb-stage"><span className="n">04</span><div><p className="t">Render</p><p className="d">Off the main thread, once. Paste each hit into a silent buffer, lay the bed loop underneath, apply the shared reverb and master chain, write an <span className="m">.m4a</span>.</p></div></div>
                        <div className="hb-stage"><span className="n">05</span><div><p className="t">Play</p><p className="d">It is now an ordinary audio file. <span className="m">AVAudioPlayer</span> plus <span className="m">MPNowPlayingInfoCenter</span>. Background audio and lock screen controls come free.</p></div></div>
                    </div>

                    <h3>What stage 3 produces</h3>
                    <p>The composer&rsquo;s output is a list of roughly 1,600 entries, each one a scheduled hit:</p>
                    <div className="hb-scroll">
                        <table>
                            <thead><tr><th>Sample</th><th>Frame</th><th>Gain</th><th>Pitch</th><th>Pan</th><th>Reverb</th></tr></thead>
                            <tbody>
                                <tr><td className="p">kick_03</td><td className="p">0</td><td className="p">1.00</td><td className="p">0</td><td className="p">0.00</td><td className="p">0.05</td></tr>
                                <tr><td className="p">hat_01</td><td className="p">11,338</td><td className="p">0.58</td><td className="p">&minus;41c</td><td className="p">+0.31</td><td className="p">0.28</td></tr>
                                <tr><td className="p">perc_07</td><td className="p">28,914</td><td className="p">0.44</td><td className="p">+88c</td><td className="p">&minus;0.52</td><td className="p">0.33</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <p>
                        <strong>That list is the timeline.</strong> It is plain data, it exists in memory for
                        about half a second, and no human ever looks at it.
                    </p>
                </section>

                {/* ── 04 ─────────────────────────────────────────────── */}
                <section>
                    <Rule n="04">Run data to music</Rule>

                    <p>
                        This is the core mapping, and the table an engineer will work from. Every value below
                        lives in <span className="m">Resources/mapping_rules.json</span>, not in Swift, so the
                        entire feel can be retuned without a code change.
                    </p>

                    <Said>prepare for mechanism pivots</Said>
                    <p>
                        That instruction is the reason the rule layer exists as data rather than constants.
                        Retuning the whole system is a JSON edit.
                    </p>

                    <h4>Run level, ten inputs</h4>
                    <div className="hb-scroll">
                        <table>
                            <thead><tr><th>Run metric</th><th>Drives</th><th>Range</th><th>State</th></tr></thead>
                            <tbody>
                                <tr><td className="k">Average heart rate</td><td>Tempo band</td><td className="p">4 bands, 116&ndash;132 BPM</td><td><span className="hb-chip live">live</span></td></tr>
                                <tr><td className="k">Average cadence</td><td>Exact BPM within the band</td><td className="p">150&ndash;190 spm, 0.7 weight</td><td><span className="hb-chip live">live</span></td></tr>
                                <tr><td className="k">HR variability</td><td>Step probability, pitch jitter, pan spread</td><td className="p">0.04&ndash;0.22 &rarr; 0.80&ndash;0.20</td><td><span className="hb-chip live">live</span></td></tr>
                                <tr><td className="k">Cardiac drift</td><td>Arrangement arc: build, hold or decay</td><td className="p">&plusmn;0.03 deadzone</td><td><span className="hb-chip live">live</span></td></tr>
                                <tr><td className="k">Pace variance</td><td>Swing and micro-timing looseness</td><td className="p">0.02&ndash;0.18 &rarr; 50&ndash;58% swing</td><td><span className="hb-chip live">live</span></td></tr>
                                <tr><td className="k">Elevation gain</td><td>Filter depth on the bed loop</td><td className="p">0&ndash;400 m &rarr; 0&ndash;0.7</td><td><span className="hb-chip live">live</span></td></tr>
                                <tr><td className="k">Active energy</td><td>Master saturation drive</td><td className="p">200&ndash;1400 kJ &rarr; 0.08&ndash;0.22</td><td><span className="hb-chip live">live</span></td></tr>
                                <tr><td className="k">Duration</td><td>Section count, hence bars per section</td><td className="p">6 min each, 3&ndash;8 total</td><td><span className="hb-chip live">live</span></td></tr>
                                <tr><td className="k">Zone distribution</td><td>Nothing. Section intensity duplicates it.</td><td className="p">&mdash;</td><td><span className="hb-chip dead">unwired</span></td></tr>
                                <tr><td className="k">Negative split</td><td>Nothing yet. Should override drift.</td><td className="p">&mdash;</td><td><span className="hb-chip dead">unwired</span></td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h4>Section level, three inputs</h4>
                    <div className="hb-scroll">
                        <table>
                            <thead><tr><th>Section metric</th><th>Drives</th><th>Range</th><th>State</th></tr></thead>
                            <tbody>
                                <tr><td className="k">Intensity</td><td>Density tier, so how many layers play</td><td className="p">5 tiers, 2&ndash;7 layers</td><td><span className="hb-chip live">live</span></td></tr>
                                <tr><td className="k">Dominant zone</td><td>Breakdown label on the track page</td><td className="p">zones 1&ndash;5</td><td><span className="hb-chip live">live</span></td></tr>
                                <tr><td className="k">Is peak</td><td>Which moment the track page calls out</td><td className="p">one per run</td><td><span className="hb-chip live">live</span></td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>Three decisions worth understanding</h3>

                    <h4>Heart rate sets the band, cadence sets the number</h4>
                    <p>
                        Average heart rate alone is a single scalar for a whole run, so a steady tempo run and a
                        brutal interval session can share it and collapse onto the same tempo. Cadence is real
                        musical tempo and separates them. Heart rate keeps the product&rsquo;s concept, cadence
                        keeps it musical.
                    </p>

                    <h4>Variability is the texture dial</h4>
                    <Said>
                        if user have a myriad of heart rate trends, we can pick the most randomised midi hits so
                        the drums is tribally and textury hits
                    </Said>
                    <p>
                        Implemented exactly as described. Patterns carry a probability per step. Low variability
                        suppresses the optional hits and the groove stays clean and sparse. High variability lets
                        them fire and the percussion goes scattered and tribal. One float, and it is the
                        difference between two tracks that would otherwise be identical.
                    </p>

                    <h4>Cardiac drift is the narrative</h4>
                    <p>
                        Heart rate climbing at constant pace is fatigue, and fatigue is the actual shape of a
                        run. Average heart rate cannot see it. Drift decides whether the arrangement builds
                        toward the end, holds flat, or decays.
                    </p>

                    <div className="hb-note">
                        <span className="h">Not yet mapped</span>
                        <p>
                            Nothing drives key or pitch. Every track is percussion-only. If the bass one-shots
                            should imply harmony rather than just thump, something has to feed root note
                            selection. Simplest workable option: assign a key per genre and rotate it by activity
                            date, so a library of thirty runs is not all in one key.
                        </p>
                    </div>
                </section>

                {/* ── 05 ─────────────────────────────────────────────── */}
                <section>
                    <Rule n="05">Architecture</Rule>

                    <Said>
                        will the app heavy more on the &ldquo;sequence manager&rdquo;? do we have to build some
                        sort of &ldquo;timeline&rdquo; like in FL or ableton to achieve this? or this is a simple
                        pick and choose and arrange workflow and i am overthinking?
                    </Said>

                    <p className="hb-lead">
                        Yes to the sequence manager, no to the timeline. The sequencing logic is real and it is
                        where all the interesting work lives. But it is a <strong>data layer</strong>, not an
                        audio layer, and it needs no interface.
                    </p>

                    <div className="hb-note">
                        <span className="h">The load-bearing decision</span>
                        <p>
                            This is not a sequencer app and it must not be built like one. It is a{" "}
                            <strong>deterministic offline renderer</strong>. The user never edits, never scrubs a
                            grid, never moves a clip. They press generate and receive a finished file. A DAW
                            timeline exists so a human can see and drag; here nothing is dragged.
                        </p>
                    </div>

                    <p>Three layers, deliberately separated:</p>

                    <div className="hb-specs">
                        <div className="hb-spec"><dt>Composer</dt><dd>Pure Swift, zero audio. Features plus seed in, scheduled hits out. Fully testable without an audio device. <span className="v">~450 lines</span></dd></div>
                        <div className="hb-spec"><dt>Renderer</dt><dd>Offline buffer summing with Accelerate, one reverb pass through an <span className="m">AVAudioEngine</span> offline graph, then file write. <span className="v">295 lines</span></dd></div>
                        <div className="hb-spec"><dt>Player</dt><dd>Plays a file. Nothing custom. Standard session category, now-playing info, remote commands. <span className="v">not built</span></dd></div>
                    </div>

                    <h3>Why this kills the performance concerns</h3>
                    <ul>
                        <li><strong>No real-time DSP</strong>, so no render callback, no main-thread audio work, and no possibility of dropouts during playback.</li>
                        <li><strong>Rendering happens once</strong>, in the background, and produces a file. Playing that file is something iOS does for you.</li>
                        <li><strong>Memory is bounded</strong>: samples are held for the few seconds of the render, then released.</li>
                        <li><strong>The only live audio in the app</strong> is the sample preview on screen four.</li>
                    </ul>

                    <h4>The one real leak risk</h4>
                    <p>
                        Building an <span className="m">AVAudioEngine</span> per sample on the picker screen.
                        Engines hold render threads and audio session state. One engine and one player node are
                        created when the screen appears and torn down when it disappears, reused for all nine
                        previews. Buffers are preloaded on appear, roughly 3.5 MB for nine mono samples, and
                        released on disappear.
                    </p>

                    <h4>Required before submission</h4>
                    <p>
                        Audio session category set to playback, the background audio capability enabled, and
                        handlers for interruptions such as an incoming call and route changes such as headphones
                        being unplugged. Apple rejects builds that ignore the last two.
                    </p>

                    <h3>Patterns are JSON, not MIDI</h3>
                    <p>
                        The sequencing logic is a MIDI-style step sequencer. The patterns are serialized as JSON
                        rather than <span className="m">.mid</span> files because the format needs three fields
                        MIDI has no room for: <span className="m">probability</span> per step,{" "}
                        <span className="m">microTiming</span> as a fraction of a step, and{" "}
                        <span className="m">ratchet</span> to subdivide one hit into several. Authoring in a DAW
                        and converting to JSON at build time is a reasonable workflow.
                    </p>
                </section>

                {/* ── 06 ─────────────────────────────────────────────── */}
                <section>
                    <Rule n="06">Making it cohere</Rule>

                    <Said>
                        glueing alone potentially (defo actually) make it too &ldquo;choppy&rdquo; or plain and
                        puzzly&ndash; unlike music sampling technique which is cohesive.
                    </Said>

                    <p>
                        Correct, and this section exists entirely because of it. Dry one-shots pasted onto a grid
                        sound like a drum machine demo, not a sampled record. Four mechanisms fix that.
                    </p>

                    <h3>The bed loop</h3>
                    <Said>
                        i imagine there should be 1 loop that play as top layer, and it loops filling the bar.
                        say, we set exported music to 64 bar, the top layer plays all the time, with automation
                        of volume curved nicely from start to end (not fully dim to 0db, but maybe -12db into 0db).
                    </Said>

                    <p>
                        Built as specified, with two refinements. A continuous loop runs underneath the entire
                        track and never stops. It is the only layer that is always present, and it is the primary
                        reason the programmed hits do not read as separate pieces glued together.
                    </p>

                    <div className="hb-specs">
                        <div className="hb-spec"><dt>Gain automation</dt><dd>S-curve from <span className="v">&minus;12 dB</span> to <span className="v">0 dB</span>, peaking at <span className="v">bar 48</span>, easing back to <span className="v">&minus;4 dB</span>. Peaking before the end means the track resolves rather than stopping at maximum.</dd></div>
                        <div className="hb-spec"><dt>Filter automation</dt><dd>Lowpass opening <span className="v">800 Hz</span> to <span className="v">18 kHz</span>. Volume alone only gets louder; the opening filter is what reads as arrival.</dd></div>
                        <div className="hb-spec"><dt>Tempo fit</dt><dd>Loops carry their native BPM in the filename. Only loops within <span className="v">&plusmn;5%</span> are eligible, so plain resampling stretches them inaudibly. Beyond that needs real time-stretching.</dd></div>
                    </div>

                    <h3>Sidechain ducking</h3>
                    <Said>sidechain not sure we need for now, a nice to have. but add it anyways.</Said>
                    <p>
                        Worth upgrading from nice-to-have. Every kick dips the bed by 4 dB over a 5 ms attack,
                        recovering across 150 ms. This is the single most effective trick available here. Without
                        it, the loop and the grid sound like two stacked recordings; with it they sound like one
                        performance.
                    </p>
                    <p>
                        Implementation note: nothing needs to be detected. The composer already knows every
                        kick&rsquo;s exact frame, so the duck envelope is written directly from that list at
                        render time.
                    </p>

                    <h3>Shared glue</h3>
                    <ul>
                        <li><strong>One reverb for everything.</strong> A single medium hall send at 18% wet. Per-sample reverbs are precisely what makes a mix sound like unrelated parts.</li>
                        <li><strong>Bus saturation.</strong> A shared <span className="m">tanh</span> nonlinearity across the whole mix. A common distortion characteristic is most of what glue means.</li>
                        <li><strong>Tail bleed.</strong> Sample tails are not cut at section boundaries.</li>
                        <li><strong>Per-hit pitch and pan jitter.</strong> Up to &plusmn;200 cents and &plusmn;0.7 pan, scaled by variability. This alone removes most of the machine-gun quality from repeated one-shots.</li>
                    </ul>

                    <h3>Master chain</h3>
                    <p>
                        Applied in this order to the summed mix: DC offset removal, then{" "}
                        <span className="m">tanh</span> saturation, then normalize to the loudness target, then
                        hard ceiling.
                    </p>
                    <div className="hb-specs">
                        <div className="hb-spec"><dt>Loudness target</dt><dd><span className="v">&minus;14 LUFS</span> integrated, matching streaming platforms</dd></div>
                        <div className="hb-spec"><dt>Ceiling</dt><dd><span className="v">&minus;1.0 dBFS</span></dd></div>
                        <div className="hb-spec"><dt>Saturation drive</dt><dd><span className="v">0.08&ndash;0.22</span>, set by the run&rsquo;s total energy</dd></div>
                    </div>

                    <div className="hb-note">
                        <span className="h">What actually gets you to the reference</span>
                        <p>
                            Mastering is not what makes this sound like Four Tet. <strong>Space is.</strong>{" "}
                            Sparse grids, long tails, heavy filtering. Do not fill the sixteenth-note grid. The
                            density tiers exist to keep quiet sections genuinely quiet.
                        </p>
                    </div>
                </section>

                {/* ── 07 ─────────────────────────────────────────────── */}
                <section>
                    <Rule n="07">Determinism</Rule>

                    <p>
                        Every random decision in the composer draws from a seeded generator, so the same activity
                        with the same samples always produces a byte-identical track.
                    </p>

                    <p>
                        The seed is <span className="m">FNV-1a(activityID, sampleSetHash, generationIndex)</span>.
                        Two specific choices matter here:
                    </p>

                    <ul>
                        <li><strong>Not Swift&rsquo;s <span className="m">Hasher</span>.</strong> It is seeded randomly per process, so using it would silently produce a different track on every cold launch. FNV-1a is stable across launches, platforms and OS versions.</li>
                        <li><strong>Independent random streams per concern.</strong> Each section and the bed draw from their own derived stream. Without this, adding a new random decision to the hi-hat logic would shift every downstream result and silently change the kick pattern of every existing track.</li>
                    </ul>

                    <h4>Regeneration</h4>
                    <p>
                        Bump <span className="m">generationIndex</span>. The user gets a different arrangement
                        from the same run, and it is still fully reproducible.
                    </p>

                    <h4>Tracks are immutable</h4>
                    <p>
                        A rendered track stores the exact sample selection it was made with. Changing genre or
                        samples in settings affects <strong>future</strong> generations only. A user&rsquo;s
                        existing library must never silently mutate under them, which also means the bundled
                        sample files can never be removed once shipped.
                    </p>
                </section>

                {/* ── 08 ─────────────────────────────────────────────── */}
                <section>
                    <Rule n="08">Sample banks</Rule>

                    <p>
                        Four genre banks. Each holds one-shots in seven role folders plus loops, its own step
                        patterns, and a <span className="m">genre.json</span> defining tempo range, roles and bed
                        behaviour.
                    </p>

                    <Said>
                        we might limit 1 sample for each type (snare, kick, etc) for color assignment wise, but
                        can multi sample for toms or pecs one shots.
                    </Said>

                    <div className="hb-specs">
                        <div className="hb-spec"><dt>Roles</dt><dd>kick, snare, hat, tom, perc, bass, fx, loops</dd></div>
                        <div className="hb-spec"><dt>Always present</dt><dd>kick and hat</dd></div>
                        <div className="hb-spec"><dt>Optional layers</dt><dd>snare, perc, tom, bass, fx</dd></div>
                        <div className="hb-spec"><dt>Multi-sample roles</dt><dd>perc and tom only, exactly as specified. One sample per role elsewhere keeps colour assignment stable.</dd></div>
                    </div>

                    <h3>File format</h3>
                    <div className="hb-scroll">
                        <table>
                            <thead><tr><th></th><th>One-shots</th><th>Loops</th></tr></thead>
                            <tbody>
                                <tr><td className="k">Format</td><td className="p">WAV</td><td className="p">WAV</td></tr>
                                <tr><td className="k">Sample rate</td><td className="p">48 kHz</td><td className="p">48 kHz</td></tr>
                                <tr><td className="k">Channels</td><td className="p">mono</td><td className="p">stereo</td></tr>
                                <tr><td className="k">Naming</td><td className="p">kick_01.wav</td><td className="p">loop_01_124bpm.wav</td></tr>
                                <tr><td className="k">Length</td><td className="p">up to 3 s</td><td className="p">4 or 8 bars</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="hb-note">
                        <span className="h">Do not use MP3</span>
                        <p>
                            MP3 encoders add roughly 26 ms of padding to the head of every file. On a one-shot
                            that means every hit lands late with a smeared transient, which is fatal for
                            percussion. This is not a quality preference, it is a timing bug.
                        </p>
                    </div>

                    <h4>Three rules that will otherwise cause silent bugs</h4>
                    <ul>
                        <li><strong>Trim leading silence.</strong> Any silence at the head of a one-shot makes that hit land late. Trim so the transient starts at sample zero, and do not fade the head.</li>
                        <li><strong>The BPM tag on loops is mandatory.</strong> Without it a loop is ineligible and the bed layer silently does not render.</li>
                        <li><strong>Sample rate must be uniform.</strong> A 44.1 kHz file summed into a 48 kHz mix plays sharp. The build script catches this and <span className="m">--fix</span> converts.</li>
                    </ul>

                    <h4>Preprocessing</h4>
                    <p>
                        Run <span className="m">python3 Tools/build_sample_manifest.py</span> after importing. It
                        validates format and precomputes a 256-point waveform envelope per sample into a
                        manifest. The UI draws from those stored floats and never decodes audio to render a
                        waveform, which is what makes a grid of nine waveforms free.
                    </p>

                    <p>
                        Bundle size is not a concern. Roughly 200 one-shots at 48 kHz mono comes to about 38 MB,
                        well within limits for shipping all four banks in the app.
                    </p>
                </section>

                {/* ── 09 ─────────────────────────────────────────────── */}
                <section>
                    <Rule n="09">Waveform UI</Rule>

                    <Fig
                        src="/heartbeat/waveform.png"
                        alt="Waveform renderer states: idle, tapped with sweep, selected with colour fill"
                        caption="The renderer states as specified: idle, tapped with the sweep unmasking left to right, selected with an assigned fill colour."
                    />

                    <Said>
                        rendered sample (tapped, unmask sweep left to right as playing just like in DAW timeline)
                    </Said>

                    <p>
                        The sample picker on screen four renders each sample as the DAW-style shape in the
                        mockups: heavy outline, filled interior, decaying to a flat tail.
                    </p>

                    <Said>
                        think of the &ldquo;simplification&rdquo; of the waveform rendering so not toooo fine
                        wiggly but not too cartoony at the same time.
                    </Said>

                    <p>That specific brief is what the following four choices solve:</p>

                    <ul>
                        <li><strong>Fixed 256 buckets per sample</strong> regardless of duration, so every tile is the same width. A short hat and a long crash both fill the tile, and the short one simply decays to a flat line earlier, which is what a DAW actually shows.</li>
                        <li><strong>Square-root amplitude curve.</strong> Linear peaks make a decaying one-shot look like a spike followed by nothing. The curve keeps the tail readable.</li>
                        <li><strong>Quadratic smoothing through midpoints</strong>, plus a heavy stroke. This is what lands the middle ground: not finely wiggly, not cartoonishly blocky.</li>
                        <li><strong>A one-pixel floor on the tail</strong>, so silence reads as a line rather than vanishing.</li>
                    </ul>

                    <p>
                        The waveform at the top of this page is generated from that same decay curve, so it is
                        the real shape rather than decoration.
                    </p>

                    <h4>Playback sweep</h4>
                    <p>
                        A single mask animation driven by one <span className="m">withAnimation</span> call with
                        linear timing over the sample&rsquo;s duration. No timer, no per-frame main-thread work.
                        Tapping a second sample stops the first and resets it to idle, enforced by the shared
                        player object.
                    </p>

                    <h4>Colour</h4>
                    <p>
                        Selected samples take an assigned fill colour. Because one-shot roles other than perc and
                        tom are limited to a single sample each, colour assignment stays stable and a colour
                        reliably identifies a role in the track breakdown.
                    </p>
                </section>

                {/* ── 10 ─────────────────────────────────────────────── */}
                <section>
                    <Rule n="10">Data integration</Rule>

                    <div className="hb-specs">
                        <div className="hb-spec"><dt>Apple Health</dt><dd>Primary source. Use an anchored query so only deltas are fetched. Background delivery is available.</dd></div>
                        <div className="hb-spec"><dt>Strava</dt><dd>Secondary. Reuse existing OAuth credentials from the JPCal project. <span className="v">path still needed</span></dd></div>
                        <div className="hb-spec"><dt>Nike Run Club</dt><dd>No public API. Dropped. Remove the button from screen one.</dd></div>
                    </div>

                    <div className="hb-note">
                        <span className="h">Strava rate limit</span>
                        <p>
                            1,000 requests per day and 100 per fifteen minutes, applied{" "}
                            <strong>per application, not per user</strong>. Fetching ten activities costs eleven
                            calls. This is a hard ceiling on how many users the app can serve, so every stream
                            must be cached permanently and never refetched.
                        </p>
                    </div>

                    <h4>Maximum heart rate</h4>
                    <p>
                        Required for zone calculation and section intensity, and not reliably available from
                        HealthKit. Either read date of birth and use 220 minus age, or ask once during
                        onboarding. <strong>This is an unresolved product decision.</strong>
                    </p>
                </section>

                {/* ── 11 ─────────────────────────────────────────────── */}
                <section>
                    <Rule n="11">Risks</Rule>

                    <h3>Strava&rsquo;s terms prohibit training models on their data</h3>
                    <Said who="Will — screen 5 copy">
                        our samples is hand-picked and our music sequences are arranged by humans. machine
                        learning helps us convert your running data and compile it based on our sequences.
                    </Said>
                    <p>
                        That second sentence is a genuine risk against Strava&rsquo;s API terms. The system is
                        rule-based, not learned, so the accurate description is also the safer one. Either reword
                        it to describe a rule-based system, or scope the claim to Apple Health data only. Worth a
                        legal read before launch.
                    </p>

                    <h3>Optical heart rate sensors lock onto cadence</h3>
                    <p>
                        Wrist sensors frequently mistake footfall for pulse at running cadence and report step
                        rate as heart rate. When that happens, the central input to the whole system is wrong. A
                        detector already exists: if heart rate tracks cadence within 4 bpm for more than half the
                        run, the stream is untrustworthy and composition should fall back to cadence-led.{" "}
                        <strong>The fallback path itself is not yet written.</strong>
                    </p>

                    <h3>Runs without heart rate data</h3>
                    <p>
                        Phone-only GPS runs and many treadmill sessions have no heart rate at all. The composer
                        must not crash or silently produce something degenerate. Needs an explicit path.
                    </p>

                    <h4>Other edge cases to handle</h4>
                    <ul>
                        <li>Activities under five minutes have too little data to arrange. Gate them out of the library.</li>
                        <li>Treadmill runs have no GPS and no elevation, so the filter mapping has nothing to work with.</li>
                        <li>Paused runs leave gaps in the stream that will skew averages if not filtered.</li>
                        <li>A genre with no eligible loop near the track tempo renders with no bed. The track will sound noticeably thinner. Import a spread of loop tempos across each genre&rsquo;s range.</li>
                    </ul>
                </section>

                {/* ── 12 ─────────────────────────────────────────────── */}
                <section>
                    <Rule n="12">Build status</Rule>

                    <p>
                        Everything below typechecks against the iOS 17 SDK. The composer has been run end to end
                        against three synthetic runs.
                    </p>

                    <h4>Built and verified</h4>
                    <div className="hb-scroll">
                        <table>
                            <thead><tr><th>Component</th><th>Purpose</th><th>Lines</th></tr></thead>
                            <tbody>
                                <tr><td className="k">Composer</td><td>Features and seed to scheduled hits</td><td className="p">311</td></tr>
                                <tr><td className="k">TrackRenderer</td><td>Arrangement to .m4a, offline</td><td className="p">295</td></tr>
                                <tr><td className="k">FeatureExtractor</td><td>Streams to features, cadence-lock detection</td><td className="p">153</td></tr>
                                <tr><td className="k">Data models</td><td>Activity, features, arrangement, track</td><td className="p">220</td></tr>
                                <tr><td className="k">WaveformView</td><td>Envelope rendering and sweep</td><td className="p">73</td></tr>
                                <tr><td className="k">SamplePreviewPlayer</td><td>Single-engine audition, one at a time</td><td className="p">74</td></tr>
                                <tr><td className="k">MappingRules + config</td><td>The retunable rule layer</td><td className="p">114</td></tr>
                                <tr><td className="k">build_sample_manifest</td><td>Format validation, envelope precompute</td><td className="p">142</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h4>Verification results</h4>
                    <p>Three synthetic runs, two sharing an identical average heart rate:</p>
                    <div className="hb-scroll">
                        <table>
                            <thead><tr><th>Run</th><th>HR variability</th><th>Tempo</th><th>Hits</th><th>Sections</th></tr></thead>
                            <tbody>
                                <tr><td className="k">Steady tempo, 32 min</td><td className="p">0.010</td><td className="p">127 BPM</td><td className="p">1,583</td><td className="p">5</td></tr>
                                <tr><td className="k">Intervals, 32 min</td><td className="p">0.118</td><td className="p">127 BPM</td><td className="p">2,012</td><td className="p">5</td></tr>
                                <tr><td className="k">Easy 5k, 26 min</td><td className="p">0.010</td><td className="p">123 BPM</td><td className="p">1,178</td><td className="p">4</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <p>
                        Two runs with the same average heart rate producing a 27% density difference is the
                        variability mapping doing real work. Determinism, regeneration and event ordering all
                        pass.
                    </p>

                    <div className="hb-note">
                        <span className="h">Two bugs the test found</span>
                        <p>
                            Bars per section was fixed, so a 32-minute run rendered a <strong>75-second</strong>{" "}
                            track. And the probability multiplier could only ever push values above 1.0, so every
                            optional step always fired regardless of variability. Both are fixed. Both were
                            silent, and would have shipped sounding acceptable but identical run to run.
                        </p>
                    </div>

                    <h4>Not built</h4>
                    <ul>
                        <li>Every screen except the sample picker components. No onboarding, no library, no track page.</li>
                        <li>Strava client and HealthKit integration.</li>
                        <li>Persistence. No store for activities, streams or rendered tracks.</li>
                        <li>Playback layer, now-playing info and remote commands.</li>
                        <li>The sample breakdown view, which is the product&rsquo;s centrepiece.</li>
                        <li>Liner note generation.</li>
                        <li>Genres two through four. Only minimal house is configured, and it holds two example patterns and no audio.</li>
                        <li>Settings, and the regeneration entry point.</li>
                        <li>Fallback paths for missing or untrustworthy heart rate.</li>
                    </ul>
                </section>

                {/* ── 13 ─────────────────────────────────────────────── */}
                <section>
                    <Rule n="13">Open decisions</Rule>

                    <Said>
                        i might forgot to jot down some mechanisms idea too that have a hole in the process
                    </Said>

                    <p>These are the holes found so far. Each needs a person, not a build step.</p>

                    <ol>
                        <li><strong>Where the Strava credentials live.</strong> Reusing the JPCal project&rsquo;s OAuth app; the path has not been provided.</li>
                        <li><strong>How maximum heart rate is obtained.</strong> Date of birth, or ask in onboarding.</li>
                        <li><strong>The reference track and automation clips.</strong> Once supplied, they become concrete values in the rule file and the bed configuration. Until then the current curves are reasoned defaults, not tuned ones.</li>
                        <li><strong>Whether key and harmony matter.</strong> Currently nothing drives pitch selection.</li>
                        <li><strong>Whether to wire negative split and zone distribution</strong>, or delete them. Both are computed and unused.</li>
                        <li><strong>Screen five copy</strong>, given the Strava terms issue in section 11.</li>
                        <li><strong>Remote repository.</strong> The project is a local git repo with one commit and no remote configured.</li>
                    </ol>

                    <h4>Suggested build order</h4>
                    <ol>
                        <li>Persistence and the HealthKit reader, so real runs reach the composer.</li>
                        <li>Import one real sample bank and author enough patterns, four to six per role, so tracks stop repeating.</li>
                        <li>Render a real track and listen. Everything above this line is unvalidated by ear.</li>
                        <li>Library screen and playback.</li>
                        <li>The sample breakdown view.</li>
                        <li>Strava, onboarding, settings.</li>
                    </ol>
                </section>

                <footer className="hb-foot">
                    hrtbt build spec &middot; composer verified against synthetic runs &middot; audio output not
                    yet validated by ear &middot; <a href="/">owillhem.art</a>
                </footer>

            </div>
        </div>
    );
}
