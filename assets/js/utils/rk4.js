/**
 * 4th-order Runge-Kutta integrator for complex-valued ODEs.
 * Supports scalar Complex or arrays of Complex.
 */

function rk4Step(f, t, y, h) {
    if (y instanceof Complex) {
        return rk4StepScalar(f, t, y, h);
    }
    if (Array.isArray(y)) {
        return rk4StepArray(f, t, y, h);
    }
    // Fallback for real numbers
    const k1 = f(t, y);
    const k2 = f(t + h / 2, y + h / 2 * k1);
    const k3 = f(t + h / 2, y + h / 2 * k2);
    const k4 = f(t + h, y + h * k3);
    return y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
}

function rk4StepScalar(f, t, y, h) {
    const k1 = f(t, y);
    const k2 = f(t + h / 2, y.add(k1.mul(h / 2)));
    const k3 = f(t + h / 2, y.add(k2.mul(h / 2)));
    const k4 = f(t + h, y.add(k3.mul(h)));
    return y.add(
        k1.add(k2.mul(2)).add(k3.mul(2)).add(k4).mul(h / 6)
    );
}

function rk4StepArray(f, t, y, h) {
    const n = y.length;
    const k1 = f(t, y);
    const y2 = y.map((yi, idx) => yi.add(k1[idx].mul(h / 2)));
    const k2 = f(t + h / 2, y2);
    const y3 = y.map((yi, idx) => yi.add(k2[idx].mul(h / 2)));
    const k3 = f(t + h / 2, y3);
    const y4 = y.map((yi, idx) => yi.add(k3[idx].mul(h)));
    const k4 = f(t + h, y4);

    return y.map((yi, idx) =>
        yi.add(
            k1[idx].add(k2[idx].mul(2)).add(k3[idx].mul(2)).add(k4[idx]).mul(h / 6)
        )
    );
}

/**
 * Integrate an ODE from t0 to t1 in nSteps steps.
 * f(t, y) → dy/dt
 */
function rk4Integrate(f, t0, t1, y0, nSteps) {
    const h = (t1 - t0) / nSteps;
    let t = t0;
    let y = Array.isArray(y0) ? y0.map(yi => yi.clone()) : y0.clone ? y0.clone() : y0;
    const trajectory = [{ t, y: Array.isArray(y) ? y.map(yi => yi.clone()) : (y.clone ? y.clone() : y) }];

    for (let step = 0; step < nSteps; step++) {
        y = rk4Step(f, t, y, h);
        t += h;
        trajectory.push({ t, y: Array.isArray(y) ? y.map(yi => yi.clone()) : (y.clone ? y.clone() : y) });
    }
    return trajectory;
}
