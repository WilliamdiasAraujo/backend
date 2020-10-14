# Mark-Presence Backend

## API Routes

| Verbo  | Rota                      | Descrição                           | Request Body | Response Body | Obs |
| ------ | ------------------------- | ----------------------------------- | ------------ | ------------- | ------ |  
| `POST`   | /resgister                | Cadastra usuário no sistema         | [CreateUserInput](#CreateUserInput) | [User](#User) |        |
| `POST`   | /login                    | Authetica usuário                   | [UserInput](#UserInput) | [UserWithToken](#UserWithToken) |        |
| `PUT`    | /users/auth                     | Edita informações do usuário authenticado        | [UserInput](#UserInput) | [User](#User) |        |
| `DELETE`    | /users/auth                     | Deleta o usuário authenticado        | - | - |        |
| `GET`    | /teams                    | Retorna todos as equipes (e os participantes) do usuário | - | [[Team]](#Team) |  |
| `POST`   | /teams                    | Cria uma nova equipe                | [CreateTeamInput](#CreateTeamInput) | [Team](#Team) |        |
| `PUT`    | /teams/:teamId            | Editar informações da equipe        | [TeamInput](#TeamInput) | [Team](#Team) |        |
| `DELETE` | /teams/:teamId            | Remove a equipe                     | - | - |        |
| `GET`    | /teams/:teamId/school-list | Retorna as listas de chamadas       | - | [[SchoolList]](#SchoolList) |        |
| `POST`   | /teams/:teamId/school-list | Cria uma nova lista de chamada      | [SchoolListInput](#SchoolListInput) | [SchoolListWithPresence](#SchoolList) |        |
| `GET`    | /school-list/:schoolListId  | Retorna informações de uma lista de chamada | - | [SchoolListWithPresence](#SchoolList) |  |
| `DELETE` | /school-list/:schoolListId  | Remove uma lista de chamada | - | - |  |
| `GET`    | /teams/:teamId/employees/:userId | Retorna as presenças de um funcionário | - | [[EmployeePresence]](#EmployeePresence) |  |
| `POST`   | /teams/:teamId/employee-presences         | Cria um novo registro de presença | [EmployeePresenceInput](#EmployeePresenceInput) | [EmployeePresence](#EmployeePresence) |  |
| `GET`    | /invitations/auth                             | Retorna os convites do usuário | - | [[Invitation]](#Invitation) |  |
| `POST`   | /teams/:teamId/invitations               | Cria novo convite da equipe | [InvitationInput](#InvitationInput)  |  |  |
| `GET`    | /invitations/:invitationId/accept        | Aceita um convite | - | [Invitation](#Invitation) |  |
| `GET`    | /invitations/:invitationId/deny          | Rejeita um convite | - | [Invitation](#Invitation) |  |
| `GET`    | /teams/:teamId/justifications            | Retorna as justificativas dos usuários dessa equipe | - | [[Justification]](#Jusitification) |  |
| `POST`   | /teams/:teamId/justifications            | Cria nova justificativa | [JustificationInput](#JustificationInput) | [Justification](#Justification) |  |
| `GET`    | /justifications/:justificationId/accept  | Aceita uma justificativa | - | [Justification](#Justification) |  |
| `GET`    | /justifications/:justificationId/deny    | Rejeita uma justificativa | - | [Justification](#Justification) |  |


<!-- | `GET`    | /teams/:teamId            | Retorna informações de uma equipe   | - | [Team](#Team) |        | -->

*?userId=:userId?from=2020-08-01

## Request Body

### CreateUserInput  
```ts
type CreateUserInput {
  name: string
  email: string
  password: string
  role: "admin" | "user"
}
```

### UserInput  
```ts
type UserInput {
  name: string
  email: string
  password: string
}
```

### CreateTeamInput  
```ts
type CreateTeamInput {
  name: string
  adress: string
  type: "school" | "bussiness"
  class_duration?: number
}
```

### TeamInput  
```ts
type TeamInput {
  name: string
  adress: string
  class_duration?: number
}
```

### SchoolListInput  
```ts
type StudentPresenceInput {
  user_id: number
  class_amount: number
}

type SchoolListInput {
  date_time: Date
  class_duration: number
  total_class_amount: number
  student_presences: StudentPresenceInput[]
}
```

### EmployeePresenceInput  
```ts
type EmployeePresenceInput {
  started_at: Date
  finished_at: Date
}
```

### InvitationInput  
```ts
type InvitationInput {
  email: string
  message?: string
}
```

### JustificationInput  
```ts
type JustificationInput {
  message: string
  media?: File
}
```

## Response Body  

### User  
```ts
type User {
  name: string
  email: string
  role: "admin" | "user"
}
```

### UserWithToken  
```ts
type Token {
  type: string
  token: string
  refreshToken: null
}

type UserWithToken {
    token: Token;
    user: User;
}
```

### Team  
```ts
type Team {
  name: string
  adress: string
  type: "school" | "bussiness"
  owner_id: number
  class_duration?: number
  users?: User[]
}
```

### SchoolList  
```ts
  type StudentPresence {
    user: User
  class_amount: number
}

type SchoolList {
  team_id: number
  datetime: Date
  total_class_amount: number
}

type SchoolListWithPresence {
  team_id: number
  datetime: Date
  total_class_amount: number
  student_presences: StudentPresenceInput[]

}
```

### EmployeePresence  
```ts
type EmployeePresence {
  started_at: Date
  finished_at: Date
  user_id: number
}
```

### Invitation  
```ts
type Invitation {
  status: "pending" | "refused"
  target_user_id: number
  team_id: number
  message: string
}
```

### Jusitification  
```ts
type Jusitification {
  team_id: number
  status: "pending" | "refused" | "accepted"
  message: string
  media_url: string
  user: User
}
```