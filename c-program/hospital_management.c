#include <stdio.h>
#include <string.h>

#define MAX_PATIENTS 100

// Structure definition for Patient
struct Patient {
    int id;
    char name[50];
    int age;
    char gender[10];
    char disease[50];
    char doctorName[50];
    int roomNumber;
};

// Global array of structures and count variable
struct Patient patients[MAX_PATIENTS];
int patientCount = 0;

// Function declarations
void addPatient();
void displayPatients();
void searchPatient();
void updatePatient();
void deletePatient();

int main() {
    int choice;

    do {
        // Display Menu
        printf("\n=========================================\n");
        printf("       HOSPITAL MANAGEMENT SYSTEM        \n");
        printf("=========================================\n");
        printf("1. Add Patient\n");
        printf("2. Display All Patients\n");
        printf("3. Search Patient\n");
        printf("4. Update Patient\n");
        printf("5. Delete Patient\n");
        printf("6. Exit\n");
        printf("=========================================\n");
        printf("Enter your choice (1-6): ");
        scanf("%d", &choice);

        // Switch statement to handle menu options
        switch (choice) {
            case 1:
                addPatient();
                break;
            case 2:
                displayPatients();
                break;
            case 3:
                searchPatient();
                break;
            case 4:
                updatePatient();
                break;
            case 5:
                deletePatient();
                break;
            case 6:
                printf("\nThank you for using Hospital Management System. Goodbye!\n");
                break;
            default:
                printf("\nInvalid choice! Please enter a number between 1 and 6.\n");
        }
    } while (choice != 6);

    return 0;
}

// Function to add a new patient
void addPatient() {
    if (patientCount >= MAX_PATIENTS) {
        printf("\nHospital capacity full! Cannot add more patients.\n");
        return;
    }

    printf("\n--- Add New Patient ---\n");

    printf("Enter Patient ID: ");
    scanf("%d", &patients[patientCount].id);

    printf("Enter Patient Name: ");
    scanf(" %[^\n]", patients[patientCount].name);

    printf("Enter Age: ");
    scanf("%d", &patients[patientCount].age);

    printf("Enter Gender: ");
    scanf("%s", patients[patientCount].gender);

    printf("Enter Disease/Diagnosis: ");
    scanf(" %[^\n]", patients[patientCount].disease);

    printf("Enter Assigned Doctor Name: ");
    scanf(" %[^\n]", patients[patientCount].doctorName);

    printf("Enter Room Number: ");
    scanf("%d", &patients[patientCount].roomNumber);

    patientCount++;
    printf("\n[SUCCESS] Patient added successfully! Total Patients: %d\n", patientCount);
}

// Function to display all patients in formatted table
void displayPatients() {
    int i;

    if (patientCount == 0) {
        printf("\nNo patients found in the record.\n");
        return;
    }

    printf("\n====================================================================================================\n");
    printf("                                      HOSPITAL PATIENT RECORDS                                      \n");
    printf("====================================================================================================\n");
    printf("%-6s %-20s %-5s %-8s %-20s %-20s %-8s\n", 
           "ID", "Name", "Age", "Gender", "Disease", "Doctor", "Room No");
    printf("----------------------------------------------------------------------------------------------------\n");

    for (i = 0; i < patientCount; i++) {
        printf("%-6d %-20s %-5d %-8s %-20s %-20s %-8d\n",
               patients[i].id,
               patients[i].name,
               patients[i].age,
               patients[i].gender,
               patients[i].disease,
               patients[i].doctorName,
               patients[i].roomNumber);
    }
    printf("====================================================================================================\n");
}

// Function to search a patient by ID
void searchPatient() {
    int searchId;
    int i;
    int found = 0;

    if (patientCount == 0) {
        printf("\nNo patients found in the record.\n");
        return;
    }

    printf("\nEnter Patient ID to search: ");
    scanf("%d", &searchId);

    for (i = 0; i < patientCount; i++) {
        if (patients[i].id == searchId) {
            printf("\n--- Patient Found ---\n");
            printf("Patient ID  : %d\n", patients[i].id);
            printf("Name        : %s\n", patients[i].name);
            printf("Age         : %d\n", patients[i].age);
            printf("Gender      : %s\n", patients[i].gender);
            printf("Disease     : %s\n", patients[i].disease);
            printf("Doctor      : %s\n", patients[i].doctorName);
            printf("Room Number : %d\n", patients[i].roomNumber);
            found = 1;
            break;
        }
    }

    if (!found) {
        printf("\nPatient not found with ID: %d\n", searchId);
    }
}

// Function to update patient information
void updatePatient() {
    int updateId;
    int i;
    int found = 0;

    if (patientCount == 0) {
        printf("\nNo patients found in the record.\n");
        return;
    }

    printf("\nEnter Patient ID to update: ");
    scanf("%d", &updateId);

    for (i = 0; i < patientCount; i++) {
        if (patients[i].id == updateId) {
            printf("\nCurrent details for %s (ID: %d):\n", patients[i].name, patients[i].id);
            printf("Disease : %s | Doctor: %s | Room: %d\n", 
                   patients[i].disease, patients[i].doctorName, patients[i].roomNumber);

            printf("\nEnter New Disease/Diagnosis: ");
            scanf(" %[^\n]", patients[i].disease);

            printf("Enter New Assigned Doctor: ");
            scanf(" %[^\n]", patients[i].doctorName);

            printf("Enter New Room Number: ");
            scanf("%d", &patients[i].roomNumber);

            printf("\n[SUCCESS] Patient details updated successfully!\n");
            found = 1;
            break;
        }
    }

    if (!found) {
        printf("\nPatient not found with ID: %d\n", updateId);
    }
}

// Function to delete a patient by ID
void deletePatient() {
    int deleteId;
    int i, j;
    int found = 0;

    if (patientCount == 0) {
        printf("\nNo patients found in the record.\n");
        return;
    }

    printf("\nEnter Patient ID to delete: ");
    scanf("%d", &deleteId);

    for (i = 0; i < patientCount; i++) {
        if (patients[i].id == deleteId) {
            // Shift remaining elements one position to the left
            for (j = i; j < patientCount - 1; j++) {
                patients[j] = patients[j + 1];
            }
            patientCount--;
            printf("\n[SUCCESS] Patient with ID %d removed successfully!\n", deleteId);
            found = 1;
            break;
        }
    }

    if (!found) {
        printf("\nPatient not found with ID: %d\n", deleteId);
    }
}
