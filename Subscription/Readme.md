# Subscription Price Tracker

A cloud-hosted Micro-SaaS app that lets users track recurring subscriptions, detect price changes, and receive renewal alerts.

---

## Overview

**Niche**: Track and manage recurring subscriptions (e.g., Netflix, SaaS tools, utilities).  
**Target audience**: Individuals and small businesses managing multiple subscriptions.  
**Monetization**: Subscription billing via Stripe. Monthly and annual plans. 14-day free trial.

---

## MVP Features

- Secure sign-up/login.
- Dashboard with all active subscriptions.
- Manual entry + optional email/statement parsing.
- Alerts for price increases, upcoming renewals, or trial expirations.
- Export as CSV.

## Growth Features

- Bank/credit card integration via Plaid/SaltEdge.
- Browser extension for quick adds.
- Shared family/team view with permissions.

---

## Tech Stack

- **Frontend**: React + TailwindCSS
- **Backend**: Node.js (Fastify) with ECS code structure
- **Database**: PostgreSQL
- **Cache/Queue**: Redis
- **Payments**: Stripe
- **Infra**: Docker, Terraform/Helm, GitHub Actions CI/CD

---

## ECS Architecture

**Entities**
- `User`, `Subscription`, `Alert`, `PaymentMethod`, `Plan`

**Components**
- `Name`, `Category`, `Price`, `RenewalDate`, `AlertType`, `IntegrationSource`, `Email`, `PasswordHash`, `Role`, `Status`

**Systems**
- `AuthSystem`, `SubscriptionSystem`, `PriceCheckSystem`, `RenewalReminderSystem`, `IntegrationSystem`, `BillingSystem`, `AlertSystem`, `UISystem`

---

## Full System Diagram

```mermaid
flowchart TD
    subgraph Client [Frontend: React + Tailwind]
        A1[Login / Sign-up Page]
        A2[Dashboard: List Subscriptions]
        A3[Add / Edit Subscription Form]
        A4[Alerts & Notifications Page]
        A5[Settings / Billing Page]
    end

    subgraph API [Backend: Node.js + Fastify (ECS)]
        S1[AuthSystem]
        S2[SubscriptionSystem - CRUD]
        S3[PriceCheckSystem]
        S4[RenewalReminderSystem]
        S5[IntegrationSystem - Plaid]
        S6[BillingSystem - Stripe]
        S7[AlertSystem]
        S8[UISystem]
    end

    subgraph Entities
        E1[User]
        E2[Subscription]
        E3[Alert]
        E4[PaymentMethod]
        E5[Plan]
    end

    subgraph Components
        C1[Name]
        C2[Category]
        C3[Price]
        C4[RenewalDate]
        C5[AlertType]
        C6[IntegrationSource]
        C7[Email]
        C8[PasswordHash]
        C9[Role]
        C10[Status]
    end

    subgraph Data
        D1[(PostgreSQL)]
        D2[(Redis - Queues)]
    end

    subgraph Infra
        I1[Docker Containers]
        I2[Cloud Deployment: AWS/GCP/Azure]
        I3[CI/CD Pipeline - GitHub Actions]
    end

    A1 --> S1
    A2 --> S2
    A3 --> S2
    A4 --> S4
    A5 --> S6

    S1 --> E1
    S2 --> E2
    S3 --> E2
    S4 --> E2
    S5 --> E4
    S6 --> E5
    S7 --> E3
    S8 --> E1
    S8 --> E2
    S8 --> E3

    E1 --> C7
    E1 --> C8
    E1 --> C9
    E1 --> C10

    E2 --> C1
    E2 --> C2
    E2 --> C3
    E2 --> C4
    E2 --> C6

    E3 --> C5
    E3 --> C4

    E4 --> C1
    E4 --> C6

    E5 --> C1
    E5 --> C9
    E5 --> C3

    S1 --> D1
    S2 --> D1
    S3 --> D1
    S4 --> D1
    S5 --> D1
    S6 --> D1

    S3 --> D2
    S4 --> D2

    D1 <--> D2
    API --> I1
    I1 --> I2
    I3 --> I2
