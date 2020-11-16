"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "Hello world in JSON and it worked!" };
});

Route.post("/register", "UserController.store"); //DONE
Route.post("/login", "UserController.login"); //DONE

Route.group(() => {
  Route.put("/users/auth", "UserController.update"); //DONE
  Route.delete("/users/auth", "UserController.destroy"); //DONE

  // TEAMS
  Route.get("/teams", "TeamController.index"); //DONE
  Route.post("/teams", "TeamController.store").middleware("role:admin"); //DONE
  // Route.get("/teams/:teamId", "TeamController.show");
  Route.put("/teams/:teamId", "TeamController.update").middleware("owner:team"); //DONE
  Route.delete("/teams/:teamId", "TeamController.destroy").middleware(
    "owner:team"
  ); //DONE

  // SCHOOL LIST
  Route.get(
    "/teams/:teamId/school-list",
    "SchoolListController.index"
  ).middleware(["owner:team", "teamType:school"]); //DOING: DONE BUT TODO: query filters
  Route.post(
    "/teams/:teamId/school-list",
    "SchoolListController.store"
  ).middleware(["owner:team", "teamType:school"]); //DONE
  Route.get(
    "/school-list/:schoolListId",
    "SchoolListController.show"
  )
  // .middleware(["owner:team", "teamType:school"]); //DONE
  Route.get(
    "teams/:teamId/student-presences/:userId",
    "SchoolListController.studentPresences"
  );
  Route.delete(
    "/school-list/:schoolListId",
    "SchoolListController.destroy"
  ).middleware(["owner:team", "teamType:school"]); //DONE

  // EMPLOYEE PRESENCES
  Route.get(
    "/teams/:teamId/employees/:userId",
    "EmployeePresenceController.index"
  ).middleware(["owner:team", "teamType:business"]); //DOING: DONE BUT TODO: query filters
  Route.get(
    "/teams/:teamId/employees-presences/auth",
    "EmployeePresenceController.auth"
  ).middleware(["teamType:business"]); //DOING: DONE BUT TODO: query filters
  Route.post(
    "/teams/:teamId/employee-presences",
    "EmployeePresenceController.store"
  ).middleware(["teamType:business"]); //DONE

  // INVITATIONS
  Route.get("/invitations/auth", "InvitationController.auth"); //DONE
  Route.get(
    "/teams/:teamId/invitations",
    "InvitationController.team"
  ).middleware(["owner:team"]); //DONE
  Route.post("/teams/:teamId/invitations", "InvitationController.store"); //DONE
  Route.get("/invitations/:invitationId/accept", "InvitationController.accept"); //DONE
  Route.get("/invitations/:invitationId/deny", "InvitationController.deny"); //DONE

  // JUSTIFICATIONS
  Route.get(
    "/teams/:teamId/justifications",
    "JustificationController.index"
  ).middleware(["owner:team"]); //  admin, owner
  Route.get(
    "/justifications/auth",
    "JustificationController.auth"
  )
  // .middleware(["owner:team"]); //  admin, owner
  Route.post("/teams/:teamId/justifications", "JustificationController.store");
  Route.get(
    "/justifications/:justificationId/accept",
    "JustificationController.accept"
  ).middleware(["owner:team"]); // admin, owner:team
  Route.get(
    "/justifications/:justificationId/deny",
    "JustificationController.deny"
  ).middleware(["owner:team"]); // admin, owner:team
}).middleware("auth");
