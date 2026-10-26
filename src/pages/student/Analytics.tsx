import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar as RBar,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { Sparkles, TrendingUp, Clock3, CalendarCheck2, HeartPulse } from 'lucide-react'
import { Glass, PageHead, FadeIn, Ring } from '../../components/ui'
import { radarData, monthlyProgress, quizAccuracy, timeSplit, heatmap, weeklyStudy } from '../../lib/data'

const tt = {
  borderRadius: 14, border: '1px solid #e7e5f2', background: 'rgba(255,255,255,0.96)',
  boxShadow: '0 10px 30px -10px rgba(93,95,160,0.3)', fontSize: 12, fontFamily: 'Figtree',
}
const heatColors = ['#efeef8', '#d9dcf7', '#b8bef0', '#939ce8', '#6d78d9']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Analytics() {
  return (
    <div>
      <PageHead crumbs={['Home', 'Performance Analytics']} title="Performance Analytics" subtitle="XGBoost predictions with SHAP explanations · refreshed 2 h ago" />

      {/* KPI row */}
      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: <TrendingUp size={17} />, label: 'Quiz Accuracy', value: '78%', sub: '▲ 6 pts this month', tone: 'bg-peri-soft text-peri-deep' },
          { icon: <Clock3 size={17} />, label: 'Study Time (week)', value: '23.5 h', sub: '▲ 3.2 h vs last week', tone: 'bg-sky-soft text-[#4a7fb5]' },
          { icon: <CalendarCheck2 size={17} />, label: 'Attendance', value: '94%', sub: '47 of 50 sessions', tone: 'bg-mint-soft text-[#3d9a6e]' },
          { icon: <HeartPulse size={17} />, label: 'Engagement Score', value: '92', sub: 'Top decile of cohort', tone: 'bg-blush-soft text-[#c76a92]' },
        ].map((k, i) => (
          <FadeIn key={k.label} delay={i * 0.05}>
            <Glass hover className="flex items-center gap-4 p-5">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${k.tone}`}>{k.icon}</div>
              <div>
                <div className="text-[11.5px] font-semibold text-muted">{k.label}</div>
                <div className="font-display text-xl font-extrabold text-ink">{k.value}</div>
                <div className="text-[10.5px] font-semibold text-[#3d9a6e]">{k.sub}</div>
              </div>
            </Glass>
          </FadeIn>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* radar */}
        <FadeIn>
          <Glass className="p-6">
            <h3 className="font-display text-[15px] font-bold text-ink">Skill radar</h3>
            <p className="mb-2 text-[11.5px] text-muted">Latent skill estimates from item-response model</p>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#e7e5f2" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10.5, fill: '#5b5876' }} />
                <Radar dataKey="score" stroke="#7d88e6" fill="#7d88e6" fillOpacity={0.28} strokeWidth={2} />
                <Tooltip contentStyle={tt} />
              </RadarChart>
            </ResponsiveContainer>
          </Glass>
        </FadeIn>

        {/* line */}
        <FadeIn delay={0.05}>
          <Glass className="p-6">
            <h3 className="font-display text-[15px] font-bold text-ink">Monthly progress</h3>
            <p className="mb-2 text-[11.5px] text-muted">Your score vs cohort average</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 6" stroke="#e7e5f2" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8a87a3' }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#8a87a3' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tt} />
                <Legend wrapperStyle={{ fontSize: 11.5 }} />
                <Line type="monotone" dataKey="score" name="You" stroke="#7d88e6" strokeWidth={2.5} dot={{ r: 3.5, fill: '#7d88e6' }} />
                <Line type="monotone" dataKey="avg" name="Cohort avg" stroke="#f0b9cf" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Glass>
        </FadeIn>

        {/* bar */}
        <FadeIn>
          <Glass className="p-6">
            <h3 className="font-display text-[15px] font-bold text-ink">Quiz accuracy by subject</h3>
            <p className="mb-2 text-[11.5px] text-muted">Last 30 days · all formats</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={quizAccuracy} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 6" stroke="#e7e5f2" vertical={false} />
                <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#8a87a3' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#8a87a3' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tt} cursor={{ fill: 'rgba(125,136,230,0.06)' }} />
                <RBar dataKey="accuracy" radius={[8, 8, 0, 0]}>
                  {quizAccuracy.map((d, i) => (
                    <Cell key={i} fill={d.accuracy >= 80 ? '#8fd4b8' : d.accuracy >= 65 ? '#9cc5ee' : '#f0b9cf'} />
                  ))}
                </RBar>
              </BarChart>
            </ResponsiveContainer>
          </Glass>
        </FadeIn>

        {/* pie */}
        <FadeIn delay={0.05}>
          <Glass className="p-6">
            <h3 className="font-display text-[15px] font-bold text-ink">Study time split</h3>
            <p className="mb-2 text-[11.5px] text-muted">How your 23.5 weekly hours are spent</p>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={timeSplit} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={0}>
                  {timeSplit.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
                <Tooltip contentStyle={tt} />
                <Legend wrapperStyle={{ fontSize: 11.5 }} iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </Glass>
        </FadeIn>
      </div>

      {/* heatmap + weekly */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <FadeIn className="lg:col-span-2">
          <Glass className="p-6">
            <h3 className="font-display text-[15px] font-bold text-ink">Study heat map</h3>
            <p className="mb-4 text-[11.5px] text-muted">Activity intensity · last 18 weeks</p>
            <div className="overflow-x-auto pb-1">
              <div className="flex min-w-max gap-2">
                <div className="flex flex-col justify-between py-0.5 pr-1 text-[9.5px] font-bold text-muted">
                  {DAYS.map(d => <span key={d} className="h-4 leading-4">{d}</span>)}
                </div>
                <div className="flex flex-col gap-1">
                  {heatmap.map((row, d) => (
                    <div key={d} className="flex gap-1">
                      {row.map((v, w) => (
                        <div key={w} title={`${DAYS[d]} · week ${w + 1} · ${v} sessions`} className="h-4 w-4 rounded-[5px] transition hover:scale-125" style={{ background: heatColors[v] }} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[10.5px] font-semibold text-muted">
              Less {heatColors.map(c => <span key={c} className="h-3 w-3 rounded-[4px]" style={{ background: c }} />)} More
            </div>
          </Glass>
        </FadeIn>

        <FadeIn delay={0.05}>
          <Glass className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
            <h3 className="font-display text-[15px] font-bold text-ink">Weekly consistency</h3>
            <Ring value={Math.round((weeklyStudy.filter(d => d.hours >= 2).length / 7) * 100)} size={110} stroke={10} color="#8fd4b8" sub="days on target" />
            <p className="text-[12px] leading-relaxed text-ink-soft">You hit your 2-hour daily target on <strong className="text-[#3d9a6e]">6 of 7 days</strong>. Sunday remains your lightest day.</p>
          </Glass>
        </FadeIn>
      </div>

      {/* AI insights */}
      <FadeIn>
        <div className="mt-5 rounded-3xl bg-gradient-to-r from-peri-soft via-lilac-soft to-blush-soft p-6">
          <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-peri-deep"><Sparkles size={16} /> AI-generated insights · Performance Agent</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              { t: 'Momentum is real', d: 'Your 6-month score trend (+25 pts) is in the top 5% of your cohort. SHAP attributes 41% of the gain to consistent AI-tutor sessions.' },
              { t: 'Thursday is your superpower', d: 'You retain 23% more from Thursday sessions. Consider scheduling your hardest topics (DP, TCP/IP) then.' },
              { t: 'Speed vs accuracy trade-off', d: 'Your answer speed rose 18% but accuracy on Hard items dipped 4%. Slowing down ~15 s per hard question should recover it.' },
            ].map(i => (
              <div key={i.t} className="rounded-2xl bg-white/75 p-4 backdrop-blur">
                <div className="text-[13px] font-bold text-ink">{i.t}</div>
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft">{i.d}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
