import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

/* ─── Hero Section ─────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-bl from-primary/5 via-surface to-secondary/5 py-20 lg:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6">
            חדש! פלטפורמה לשיווק ישיר
          </Badge>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
            <span className="text-primary">הטעם</span> של השכונה
          </h1>
          <p className="mb-10 text-lg text-text-muted md:text-xl">
            פלטפורמה שמחברת יצרנים וחקלאים ישירות לנקודות איסוף שכונתיות.
            <br className="hidden md:block" />
            ללא מתווכים. טרי. מקומי. הוגן.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="primary">
              אני רוצה לקנות
            </Button>
            <Button size="lg" variant="secondary">
              אני ספק / חקלאי
            </Button>
            <Button size="lg" variant="outline">
              אני נקודת איסוף
            </Button>
          </div>
        </div>
      </Container>

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/5" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-secondary/5" />
    </section>
  );
}

/* ─── How It Works ─────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      icon: "🌾",
      title: "ספק מעלה מוצרים",
      description:
        "חקלאים ויצרנים מקומיים נרשמים ומעלים את המוצרים שלהם, קובעים מחיר ותאריכי אספקה.",
    },
    {
      icon: "🏪",
      title: "נקודה משווקת",
      description:
        "נקודות איסוף שכונתיות מקבלות דף נחיתה ייחודי, משווקות ללקוחות ומנהלות את ההזמנות.",
    },
    {
      icon: "🛒",
      title: "לקוח אוסף",
      description:
        "לקוחות מזמינים, משלמים ואוספים מהנקודה הקרובה. טרי, נוח, וישירות מהיצרן.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">איך זה עובד?</h2>
          <p className="text-text-muted text-lg">שלושה צעדים פשוטים</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl">
                {step.icon}
              </div>
              <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">
                {i + 1}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="text-text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ─── Categories ───────────────────────────────────────────── */
function Categories() {
  const categories = [
    { icon: "🍎", name: "ירקות ופירות", count: "120+ מוצרים" },
    { icon: "🥖", name: "מזון ומאפים", count: "80+ מוצרים" },
    { icon: "🧥", name: "ביגוד ואופנה", count: "בקרוב" },
    { icon: "🍯", name: "דבש ותבלינים", count: "40+ מוצרים" },
    { icon: "🧀", name: "מחלבה", count: "60+ מוצרים" },
    { icon: "🫒", name: "שמנים וזיתים", count: "30+ מוצרים" },
  ];

  return (
    <section id="categories" className="bg-white py-20">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">קטגוריות</h2>
          <p className="text-text-muted text-lg">מגוון רחב של מוצרים מקומיים ואיכותיים</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, i) => (
            <Card key={i} className="cursor-pointer text-center hover:border-primary border border-transparent">
              <div className="mb-3 text-4xl">{cat.icon}</div>
              <h3 className="mb-1 font-semibold">{cat.name}</h3>
              <p className="text-sm text-text-muted">{cat.count}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ─── Upcoming Fairs ───────────────────────────────────────── */
function UpcomingFairs() {
  const fairs = [
    {
      title: "יריד ירקות אורגניים",
      supplier: "משק השרון",
      location: "נקודת איסוף כפר סבא",
      date: "28.03.2026",
      time: "08:00–14:00",
    },
    {
      title: "טעימות דבש ושמנים",
      supplier: "כוורת הגליל",
      location: "נקודת איסוף חיפה מרכז",
      date: "01.04.2026",
      time: "10:00–16:00",
    },
    {
      title: "יריד גבינות מקומיות",
      supplier: "מחלבת הבוקר",
      location: "נקודת איסוף באר שבע",
      date: "04.04.2026",
      time: "09:00–13:00",
    },
  ];

  return (
    <section id="fairs" className="py-20">
      <Container>
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4">חדש!</Badge>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">ירידים קרובים</h2>
          <p className="text-text-muted text-lg">
            ספקים פותחים שולחנות מכירה בנקודות האיסוף — בואו לטעום!
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {fairs.map((fair, i) => (
            <Card key={i} className="border-r-4 border-r-secondary">
              <div className="mb-3 flex items-center justify-between">
                <Badge variant="secondary">{fair.date}</Badge>
                <span className="text-sm text-text-muted">{fair.time}</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">{fair.title}</h3>
              <p className="text-sm text-text-muted mb-1">🌾 {fair.supplier}</p>
              <p className="text-sm text-text-muted">📍 {fair.location}</p>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                פרטים נוספים
              </Button>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ─── For Suppliers ────────────────────────────────────────── */
function ForSuppliers() {
  const benefits = [
    { icon: "💰", title: "מכירה ישירה", text: "אתם קובעים את המחיר, בלי מתווכים." },
    { icon: "📊", title: "דשבורד ניהול", text: "צפייה בהזמנות, ניהול מוצרים, דוחות מכירה." },
    { icon: "🗺️", title: "פריסה ארצית", text: "גישה לנקודות איסוף בכל רחבי הארץ." },
    { icon: "🎪", title: "ירידי מכירה", text: "אפשרות לפתוח יריד מכירה ישירה בנקודות." },
  ];

  return (
    <section id="for-suppliers" className="bg-primary/5 py-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge variant="primary" className="mb-4">לספקים וחקלאים</Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              הגיע הזמן למכור ישירות
            </h2>
            <p className="mb-8 text-text-muted text-lg">
              הצטרפו לפלטפורמה, העלו מוצרים, ותתחילו למכור ישירות ללקוחות דרך
              רשת נקודות האיסוף שלנו. בלי מתווכים, בלי ספקולציות.
            </p>
            <Button size="lg" variant="primary">
              הרשמה כספק
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((b, i) => (
              <Card key={i}>
                <div className="mb-3 text-3xl">{b.icon}</div>
                <h3 className="mb-1 font-semibold">{b.title}</h3>
                <p className="text-sm text-text-muted">{b.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ─── For Pickup Points ────────────────────────────────────── */
function ForPickupPoints() {
  const benefits = [
    { icon: "🌐", title: "דף נחיתה ייחודי", text: "דף מכירה מותאם אישית לנקודה שלכם." },
    { icon: "📱", title: "ניהול מהנייד", text: "קבלו הזמנות, עדכנו סטטוסים, שלחו הודעות." },
    { icon: "💸", title: "עמלה על כל מכירה", text: "הרוויחו אחוז מכל מכירה שעוברת דרככם." },
    { icon: "👥", title: "בניית קהילה", text: "הפכו את הנקודה שלכם למקום מפגש שכונתי." },
  ];

  return (
    <section id="for-points" className="py-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 grid gap-4 sm:grid-cols-2 lg:order-1">
            {benefits.map((b, i) => (
              <Card key={i}>
                <div className="mb-3 text-3xl">{b.icon}</div>
                <h3 className="mb-1 font-semibold">{b.title}</h3>
                <p className="text-sm text-text-muted">{b.text}</p>
              </Card>
            ))}
          </div>
          <div className="order-1 lg:order-2">
            <Badge variant="secondary" className="mb-4">לנקודות איסוף</Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              הפכו את החנות למרכז שכונתי
            </h2>
            <p className="mb-8 text-text-muted text-lg">
              הצטרפו כנקודת איסוף, קבלו מוצרים טריים מספקים מקומיים, והרוויחו
              עמלה על כל מכירה. פשוט, נוח, ומשתלם.
            </p>
            <Button size="lg" variant="secondary">
              הרשמה כנקודת איסוף
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ─── Stats ────────────────────────────────────────────────── */
function Stats() {
  const stats = [
    { value: "50+", label: "ספקים פעילים" },
    { value: "120+", label: "נקודות איסוף" },
    { value: "5,000+", label: "לקוחות מרוצים" },
    { value: "7", label: "אזורים בארץ" },
  ];

  return (
    <section className="bg-primary py-16 text-white">
      <Container>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="mb-2 text-3xl font-extrabold md:text-4xl">
                {stat.value}
              </div>
              <div className="text-primary-light text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ─── Contact ──────────────────────────────────────────────── */
function Contact() {
  return (
    <section id="contact" className="bg-white py-20">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">צור קשר</h2>
            <p className="text-text-muted text-lg">
              שאלות? הצעות? נשמח לשמוע מכם
            </p>
          </div>
          <Card className="p-8">
            <form className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium">שם מלא</label>
                <input
                  type="text"
                  placeholder="הכנס שם מלא"
                  className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">נייד</label>
                  <input
                    type="tel"
                    placeholder="050-0000000"
                    className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">מייל</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    dir="ltr"
                    className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">הודעה</label>
                <textarea
                  rows={4}
                  placeholder="ספרו לנו במה נוכל לעזור..."
                  className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
              <Button type="submit" variant="primary" size="lg" className="w-full">
                שלח פניה
              </Button>
            </form>
          </Card>
        </div>
      </Container>
    </section>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Categories />
        <UpcomingFairs />
        <ForSuppliers />
        <Stats />
        <ForPickupPoints />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
