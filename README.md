# Metabolic Health Lab

Interactive, browser-only laboratory practical for **SPO007-6 Metabolic Health**, University of Bedfordshire. Academic lead: Dr Mike Newell.

## Run locally

Serve the folder with `python3 -m http.server 8000` and visit http://localhost:8000. Opening the file using `file://` directly may block JavaScript modules in some browsers. No package installation, build step, API, student account or database is required.

## Publish with GitHub Pages

1. Create a repository named `metabolic-health-lab` on your chosen GitHub account.
2. Upload all files, including `.github/workflows/pages.yml` and `.nojekyll`, to the `main` branch.
3. Go to **Settings > Pages > Build and deployment**, choose **GitHub Actions**.
4. Commit a change or run the **Deploy static laboratory to GitHub Pages** workflow from Actions.
5. Visit `https://YOUR-USERNAME.github.io/metabolic-health-lab/` once the Pages deployment reports success.

Because all asset links are relative, the site works at either a repository subpath or a domain root. **Do not host participant-identifiable information.**

## Laboratory design

- Baseline measurement (0–15 min); transition (15–20); 20-min cycling (20–40); transition (40–45); recovery (45–75).
- Heart-rate-reserve targets: low 20–40%; vigorous 60–80%.
- Five measurement periods: baseline, cycling 5–10, cycling 15–20, immediate recovery, later recovery.
- Input VO₂ and VCO₂ in L/min or mL/min; derived RER, carbohydrate/fat oxidation and abbreviated Weir energy expenditure.
- Interactive raw gas-exchange CSV import, manual measurements, local sessions, results charts, export and group comparisons.
- Seven interactive reasoning challenges, synthetic demo dataset and teaching settings.

## Data

Records autosave in browser `localStorage`, not remotely. Export JSON regularly for backups. Clearing local browser storage or switching device will remove access to unsaved records. JSON import restores a session or merges it as a comparison group. CSV export is de-identified. The raw CSV import expects a time/minute column, VO₂ and VCO₂; common column names are recognised. If the file uses unrecognised headings, select the corresponding columns in the importer.

## Scientific limitations

VO₂ and VCO₂ are standardised to L/min. Calculations assume negligible protein oxidation, and estimated substrate oxidation is not interpretable during major departures from steady state or RER > 1.0. Post-exercise metabolic expenditure is not interchangeable with resting metabolic rate. HRmax = 220 − age is a population approximation. The protocol and any safety decisions require laboratory supervision.

## References

- Venables MC, Achten J, Jeukendrup AE (2005). Determinants of fat oxidation during exercise in healthy men and women. *Journal of Applied Physiology*, 98, 160–167.
- Jeukendrup AE, Wallis GA (2005). Measurement of substrate oxidation during exercise by means of gas exchange measurements. *International Journal of Sports Medicine*, 26, 28–37.
- Norton K, Norton L, Sadgrove D (2010). Position statement on physical activity and exercise intensity terminology. *Journal of Science and Medicine in Sport*, 13, 496–502.

## Licence

See [LICENSE.md](LICENSE.md) and [licence.html](licence.html). This mirrors the rights approach of the existing resting-metabolic-lab project.
