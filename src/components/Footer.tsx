import Container from "./ui/Container";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-12">
      <Container>
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌿</span>
              <span className="text-lg font-bold text-primary">LOCALITY</span>
            </div>
            <p className="text-text-muted text-sm">
              הטעם של השכונה — פלטפורמה לשיווק ישיר מיצרנים לנקודות איסוף
              שכונתיות.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 font-semibold">ניווט</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><a href="#how-it-works" className="hover:text-primary transition-colors">איך זה עובד</a></li>
              <li><a href="#categories" className="hover:text-primary transition-colors">קטגוריות</a></li>
              <li><a href="#fairs" className="hover:text-primary transition-colors">ירידים קרובים</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">הצטרפו</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><a href="#for-suppliers" className="hover:text-primary transition-colors">אני ספק / חקלאי</a></li>
              <li><a href="#for-points" className="hover:text-primary transition-colors">אני נקודת איסוף</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">צור קשר</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">משפטי</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><a href="/terms" className="hover:text-primary transition-colors">תנאי שימוש</a></li>
              <li><a href="/privacy" className="hover:text-primary transition-colors">מדיניות פרטיות</a></li>
              <li><a href="/accessibility" className="hover:text-primary transition-colors">נגישות</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-8 text-center text-sm text-text-muted">
          &copy; {new Date().getFullYear()} LOCALITY. כל הזכויות שמורות.
        </div>
      </Container>
    </footer>
  );
}
