# CashFlow OS 💰

### AI-Powered Financial Co-Pilot for Indian Small Businesses

CashFlow OS is an AI-powered financial intelligence platform designed to help small businesses understand their cash position, predict future cash-flow problems, identify risky customer payments, and make smarter working-capital decisions.

Instead of only recording financial transactions, CashFlow OS turns business financial data into **forward-looking, explainable actions**.

> **Know when your money will run out, whom to collect from, and whether borrowing is actually safe.**

---

## 🎯 The Problem

Small businesses frequently face cash-flow problems because of:

- Delayed customer payments
- Poor visibility into future cash balances
- Manual invoice tracking
- Unpredictable expenses
- Customers who repeatedly pay late
- Taking loans without understanding whether borrowing is necessary

A business can be profitable and still run out of cash when money is locked in overdue invoices.

CashFlow OS focuses on this gap by combining financial data, forecasting, risk analysis, and AI-driven recommendations.

---

## 💡 The Solution

CashFlow OS combines:

```text
Transactions
     +
Invoices
     +
Customer Payment History
     +
Cash-Flow Forecasting
     +
Financial Health
     +
AI
     ↓
Actionable Business Recommendation
```

For example:

> **Customer A has ₹18,000 outstanding and a high payment-risk score. Follow up with Customer A first. No major cash shortage is projected in the next 30 days, so taking a new loan is currently unnecessary.**

The goal is to provide a business owner with a **decision**, not just another financial report.

---

# ✨ Key Features

## 📊 1. Cash-Flow Forecasting

Predicts the business's projected cash balance over the next 30 days.

Provides:

* Daily projected balances
* Future cash position
* Cash-shortage detection
* Shortage date
* Shortage amount

This allows businesses to identify potential cash problems before they occur.

---

## 🧾 2. Invoice Management

Tracks business invoices and their payment status.

The system can identify:

* Outstanding invoices
* Overdue invoices
* Customer payment history
* Total outstanding amounts
* Customer-level overdue rates

---

## 📥 3. CSV Transaction Import

Businesses can upload transaction data through CSV files.

Example:

```text
Supplier payment     ₹15,000   EXPENSE
Customer payment      ₹5,000   INCOME
Office supplies       ₹3,000   EXPENSE
Invoice payment      ₹12,000   INCOME
```

Transactions are automatically imported and stored in PostgreSQL.

---

## ⚠️ 4. Customer Payment Risk

Analyzes historical invoice behavior to identify customers who are likely to pay late.

Example:

```json
{
  "customerName": "Test Customer",
  "expectedDelayDays": 15,
  "latePaymentProbability": 100.0,
  "riskLevel": "HIGH"
}
```

This helps businesses prioritize collections.

---

## 🔮 5. Payment-Delay Prediction

Predicts:

* Expected payment delay
* Late-payment probability
* Customer risk level
* Reason behind the prediction

Example:

> **Expected delay: 15 days**
> **Late payment probability: 100%**
> **Risk: HIGH**

---

## 🏦 6. Financial Health Score

Evaluates whether the business is currently in a healthy position to borrow.

Example:

```json
{
  "borrowingSafe": true,
  "score": 90,
  "status": "HEALTHY",
  "explanation": "The business has a healthy cash position and no major projected cash-flow risk."
}
```

Instead of automatically recommending loans, CashFlow OS first evaluates whether borrowing is actually necessary and financially safe.

---

## 💡 7. Financial Recommendations

Combines financial signals to recommend the next business action.

Possible actions include:

* Collect overdue payments
* Delay an expense
* Use available savings
* Consider financing when appropriate

Example:

> **Follow up with high-risk customers on overdue invoices.**

---

## 💬 8. Collection Assistant

Generates personalized payment-reminder messages for customers with overdue invoices.

Example:

> **Dear Test Customer,**
>
> This is a friendly payment reminder from CashFlow OS.
>
> **Outstanding Amount: ₹18,000**
>
> Kindly arrange to clear this payment.
>
> Thank you for your business!

The system can use customer risk and invoice information to prioritize collection efforts.

---

## 🤖 9. AI Financial Insights

CashFlow OS uses AI to turn financial information into understandable business insights.

Instead of only displaying:

```text
Balance: ₹64,400
Outstanding: ₹18,000
Risk: HIGH
```

the system can provide an explanation such as:

> **No cash shortage projected in the next 30 days. Cash flow looks healthy.**

The AI layer focuses on turning financial signals into useful business decisions.

---

## 🔄 10. Scenario Simulation

Allows businesses to simulate financial decisions before applying them.

For example:

```text
What happens if a customer pays ₹18,000?
```

or:

```text
What happens if the business has another ₹10,000 expense?
```

The system calculates the financial impact and can persist the scenario as an actual transaction.

Example:

```text
Customer payment - scenario applied
₹18,000
INCOME
```

This provides a simple **"what-if" financial planning capability**.

---

# 🧠 AI Decision Layer

The core idea behind CashFlow OS is that AI should not operate in isolation.

The AI works on top of structured financial signals.

```text
                    Business Data
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
   Transactions       Invoices        Customers
        │                │                │
        └────────────────┼────────────────┘
                         ↓
                 Financial Analysis
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
 Cash Forecast      Risk Analysis     Health Score
        │                │                │
        └────────────────┼────────────────┘
                         ↓
                  AI Intelligence
                         │
                         ↓
                Explainable Insight
                         │
                         ↓
               Recommended Action
```

This makes the AI an **intelligence layer over financial data**, rather than simply a chatbot.

---

# 🏗️ Architecture

```text
                    CashFlow OS
                         │
                         ↓
                 Spring Boot API
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
   Controllers        Services        AI Services
        │                │                │
        └────────────────┼────────────────┘
                         ↓
                   Repositories
                         │
                         ↓
                    PostgreSQL
```

### Backend Architecture

```text
Controller
     ↓
Service
     ↓
Repository
     ↓
PostgreSQL
```

The layered architecture separates API handling, business logic, data access, and AI-related processing.

---

# 🛠️ Technology Stack

| Layer            | Technology                  |
| ----------------- | --------------------------- |
| Backend           | Spring Boot                 |
| Language          | Java                        |
| Database          | PostgreSQL                  |
| ORM               | Spring Data JPA / Hibernate |
| AI                | Gemini API                  |
| Build Tool        | Maven                       |
| API Testing       | Postman                     |
| Version Control   | Git / GitHub                |

---

# 📁 Project Structure

```text
CashFlow_OS/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/demo/
│   │   │       │
│   │   │       ├── controller/
│   │   │       ├── model/
│   │   │       ├── repository/
│   │   │       └── service/
│   │   │
│   │   └── resources/
│   │       └── application.properties
│   │
│   └── test/
│
├── pom.xml
├── mvnw
├── mvnw.cmd
├── .gitignore
└── README.md
```

---

# 🔌 API Modules

The current backend contains API modules for:

| Module               | Purpose                     |
| --------------------- | --------------------------- |
| Business              | Business management         |
| Transactions          | Income and expense tracking |
| CSV Import            | Bulk transaction upload     |
| Invoices              | Invoice management          |
| Forecast              | Cash-flow forecasting       |
| Risk                  | Customer payment risk       |
| Payment Prediction    | Expected payment delay      |
| Financial Health      | Borrowing safety            |
| Recommendations       | Financial actions           |
| Collection Messages   | Payment reminder generation |
| AI Insights           | AI financial analysis       |
| Scenarios             | What-if simulations         |

---

# 🧪 Tested Workflow

The backend has been tested through API requests using Postman.

A representative workflow:

```text
1. Create / identify business
        ↓
2. Add transactions
        ↓
3. Upload transaction CSV
        ↓
4. Add invoices
        ↓
5. Analyze overdue customers
        ↓
6. Predict payment delays
        ↓
7. Generate cash-flow forecast
        ↓
8. Evaluate financial health
        ↓
9. Generate recommendations
        ↓
10. Generate collection message
        ↓
11. Run financial scenario
        ↓
12. Save scenario result to PostgreSQL
```

---

# 📈 Example Business Scenario

Consider a business with:

```text
Current Balance:       ₹65,000
Outstanding Invoices:  ₹1,80,000
Monthly Expenses:       ₹90,000
High-Risk Customers:          2
```

CashFlow OS can identify a risky customer and recommend:

```text
Customer B
Outstanding: ₹70,000
Risk Level: HIGH

Recommended Action:
Follow up with Customer B first.

Reason:
Customer B has a history of delayed payments.
```

The business can then simulate different outcomes before deciding whether additional financing is necessary.

---

# 💾 Database

CashFlow OS uses PostgreSQL for persistent storage.

The application uses Spring Data JPA / Hibernate for database interaction.

During development, the database schema is automatically updated using:

```properties
spring.jpa.hibernate.ddl-auto=update
```

---

# 🚀 Getting Started

## Prerequisites

Install:

* Java 17+
* Maven
* PostgreSQL
* Git
* Postman

## Clone the Repository

```bash
git clone https://github.com/Goutamishirol/CashFlow_OS.git
cd CashFlow_OS
```

## Configure PostgreSQL

Create a PostgreSQL database:

```text
cashflowdb
```

Configure your database connection in:

```text
src/main/resources/application.properties
```

## Set your Gemini API key

```powershell
setx GOOGLE_API_KEY "your-key-here"
```

**Never commit your API key** — keep it out of `application.properties` and ensure `.gitignore` excludes any file containing it.

## Run the Application

Windows:

```bash
mvnw.cmd spring-boot:run
```

or:

```bash
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

---

# 🧪 API Testing

The backend can be tested using Postman.

Example transaction endpoints:

```text
POST /api/transactions
GET  /api/transactions/{businessId}
POST /api/transactions/upload
```

Additional endpoints provide forecasting, customer risk, payment prediction, financial health, recommendations, collection messages, AI insights, and scenario simulation.

---

# 💰 Business Model

CashFlow OS can potentially monetize through:

### SaaS Subscription

Monthly plans for small businesses.

### Collection / Invoice Processing

Optional fees for collection-related services.

### Financing Referral

Referral revenue from regulated lenders and invoice-financing platforms.

### B2B API Licensing

Financial intelligence APIs for:

* Banks
* NBFCs
* Accounting platforms
* B2B marketplaces
* Fintech companies

---

# 🔮 Future Scope

The platform can be extended with:

* React + Vite dashboard
* AI financial co-pilot chat
* WhatsApp integration
* GST verification
* Account Aggregator integration
* Bank transaction integration
* Regional-language AI
* Invoice OCR
* Duplicate invoice detection
* Fraud detection
* Working-capital marketplace
* Financing eligibility intelligence
* Advanced customer default prediction
* Automated financial alerts

---

# 🎯 Why CashFlow OS?

Traditional financial software primarily answers:

> **"What happened to my money?"**

CashFlow OS aims to answer:

> **"What is going to happen, why is it happening, and what should I do next?"**

The platform combines forecasting, collections, customer risk, financial health, scenarios, and AI into one decision-support layer for small businesses.

---

# 🏆 Project Vision

> **CashFlow OS helps small businesses know when money will run out, whom to collect from, and whether borrowing is actually safe.**

The long-term vision is to build an **AI financial operating layer for small businesses**, connecting cash flow, collections, financial health, and working-capital decisions in one simple platform.

---

## ⚠️ Disclaimer

CashFlow OS is currently a prototype designed for demonstration and development purposes.

Financial insights and recommendations should not be considered professional financial advice. A production deployment would require appropriate security, compliance, consent management, financial-data protection, and integration with regulated financial institutions.

---

## 👥 Built For

**Hackathon / Founder Prototype**

### CashFlow OS

**AI-powered financial intelligence for Indian small businesses.**
