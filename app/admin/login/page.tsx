import { login } from './actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-logo">F<span>S</span>O</div>
        <div className="login-sub">Panel de administración</div>

        {error && <div className="login-error">Contraseña incorrecta. Intentá de nuevo.</div>}

        <form action={login}>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              required
              autoFocus
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
