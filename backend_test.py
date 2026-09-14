#!/usr/bin/env python3
"""
Backend API Test Suite for Kedia and Associates
Tests all backend endpoints including auth, CRUD operations, and validation
"""
import requests
import json
from typing import Optional

# Base URL from frontend/.env
BASE_URL = "https://knowledge-hub-1066.preview.emergentagent.com/api"

# Test credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

# Global token storage
admin_token: Optional[str] = None

# Test results tracking
test_results = {
    "passed": [],
    "failed": [],
    "total": 0
}


def log_test(test_name: str, passed: bool, details: str = ""):
    """Log test result"""
    test_results["total"] += 1
    if passed:
        test_results["passed"].append(test_name)
        print(f"✅ PASS: {test_name}")
        if details:
            print(f"   {details}")
    else:
        test_results["failed"].append(test_name)
        print(f"❌ FAIL: {test_name}")
        if details:
            print(f"   {details}")
    print()


def test_root():
    """Test 1: GET /api/ should return message"""
    print("=" * 80)
    print("TEST 1: GET /api/ - Root endpoint")
    print("=" * 80)
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200 and "message" in response.json():
            log_test("GET /api/ returns message", True, f"Message: {response.json()['message']}")
            return True
        else:
            log_test("GET /api/ returns message", False, f"Expected 200 with message, got {response.status_code}")
            return False
    except Exception as e:
        log_test("GET /api/ returns message", False, f"Exception: {str(e)}")
        return False


def test_admin_login():
    """Test 2: POST /api/admin/login with correct and incorrect credentials"""
    global admin_token
    
    print("=" * 80)
    print("TEST 2: POST /api/admin/login - Admin authentication")
    print("=" * 80)
    
    # Test correct credentials
    try:
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD}
        )
        print(f"Correct credentials - Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200 and "token" in response.json():
            admin_token = response.json()["token"]
            log_test("POST /api/admin/login with correct credentials", True, f"Token received: {admin_token[:20]}...")
        else:
            log_test("POST /api/admin/login with correct credentials", False, f"Expected 200 with token, got {response.status_code}")
            return False
    except Exception as e:
        log_test("POST /api/admin/login with correct credentials", False, f"Exception: {str(e)}")
        return False
    
    # Test incorrect credentials
    try:
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"username": ADMIN_USERNAME, "password": "wrongpassword"}
        )
        print(f"Wrong password - Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 401:
            log_test("POST /api/admin/login with wrong password returns 401", True)
        else:
            log_test("POST /api/admin/login with wrong password returns 401", False, f"Expected 401, got {response.status_code}")
    except Exception as e:
        log_test("POST /api/admin/login with wrong password returns 401", False, f"Exception: {str(e)}")
    
    return True


def test_services_list():
    """Test 3: GET /api/services (public) should return 12 seeded services"""
    print("=" * 80)
    print("TEST 3: GET /api/services - List services (public)")
    print("=" * 80)
    
    try:
        response = requests.get(f"{BASE_URL}/services")
        print(f"Status: {response.status_code}")
        services = response.json()
        print(f"Number of services: {len(services)}")
        
        if len(services) > 0:
            print(f"First service: {services[0]}")
        
        if response.status_code == 200 and len(services) == 12:
            # Check structure
            required_fields = ["title", "desc", "icon", "order", "id"]
            first_service = services[0]
            has_all_fields = all(field in first_service for field in required_fields)
            
            if has_all_fields:
                log_test("GET /api/services returns 12 seeded services with correct structure", True, 
                        f"Services count: {len(services)}, Fields: {list(first_service.keys())}")
                return services
            else:
                log_test("GET /api/services returns 12 seeded services with correct structure", False, 
                        f"Missing fields. Expected: {required_fields}, Got: {list(first_service.keys())}")
                return services
        else:
            log_test("GET /api/services returns 12 seeded services", False, 
                    f"Expected 12 services, got {len(services)}")
            return services
    except Exception as e:
        log_test("GET /api/services returns 12 seeded services", False, f"Exception: {str(e)}")
        return []


def test_expertise_list():
    """Test 4: GET /api/expertise (public) should return 10 seeded expertise items"""
    print("=" * 80)
    print("TEST 4: GET /api/expertise - List expertise (public)")
    print("=" * 80)
    
    try:
        response = requests.get(f"{BASE_URL}/expertise")
        print(f"Status: {response.status_code}")
        expertise = response.json()
        print(f"Number of expertise items: {len(expertise)}")
        
        if len(expertise) > 0:
            print(f"First expertise: {expertise[0]}")
        
        if response.status_code == 200 and len(expertise) == 10:
            log_test("GET /api/expertise returns 10 seeded items", True, 
                    f"Expertise count: {len(expertise)}")
            return expertise
        else:
            log_test("GET /api/expertise returns 10 seeded items", False, 
                    f"Expected 10 items, got {len(expertise)}")
            return expertise
    except Exception as e:
        log_test("GET /api/expertise returns 10 seeded items", False, f"Exception: {str(e)}")
        return []


def test_inquiry_creation():
    """Test 5: POST /api/inquiries with valid and invalid data"""
    print("=" * 80)
    print("TEST 5: POST /api/inquiries - Create inquiry (public)")
    print("=" * 80)
    
    # Test valid inquiry
    valid_inquiry = {
        "name": "Rajesh Kumar",
        "email": "rajesh.kumar@example.com",
        "country_code": "+977",
        "phone": "9812345678",
        "company": "Kumar Enterprises",
        "service": "Tax Audit",
        "message": "I need assistance with tax audit for FY 2024-25"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/inquiries", json=valid_inquiry)
        print(f"Valid inquiry - Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code in [200, 201]:
            inquiry_data = response.json()
            if "id" in inquiry_data:
                log_test("POST /api/inquiries with valid data succeeds", True, 
                        f"Inquiry created with ID: {inquiry_data['id']}")
                inquiry_id = inquiry_data["id"]
            else:
                log_test("POST /api/inquiries with valid data succeeds", False, 
                        "Response missing 'id' field")
                inquiry_id = None
        else:
            log_test("POST /api/inquiries with valid data succeeds", False, 
                    f"Expected 200/201, got {response.status_code}")
            inquiry_id = None
    except Exception as e:
        log_test("POST /api/inquiries with valid data succeeds", False, f"Exception: {str(e)}")
        inquiry_id = None
    
    # Test invalid phone (not 10 digits)
    invalid_inquiry_short = {
        "name": "Test User",
        "email": "test@example.com",
        "country_code": "+977",
        "phone": "12345",
        "message": "Test"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/inquiries", json=invalid_inquiry_short)
        print(f"Invalid phone (5 digits) - Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 400:
            log_test("POST /api/inquiries with phone '12345' returns 400", True)
        else:
            log_test("POST /api/inquiries with phone '12345' returns 400", False, 
                    f"Expected 400, got {response.status_code}")
    except Exception as e:
        log_test("POST /api/inquiries with phone '12345' returns 400", False, f"Exception: {str(e)}")
    
    # Test invalid phone (non-numeric)
    invalid_inquiry_alpha = {
        "name": "Test User",
        "email": "test@example.com",
        "country_code": "+977",
        "phone": "abcdefghij",
        "message": "Test"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/inquiries", json=invalid_inquiry_alpha)
        print(f"Invalid phone (alphabetic) - Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 400:
            log_test("POST /api/inquiries with phone 'abcdefghij' returns 400", True)
        else:
            log_test("POST /api/inquiries with phone 'abcdefghij' returns 400", False, 
                    f"Expected 400, got {response.status_code}")
    except Exception as e:
        log_test("POST /api/inquiries with phone 'abcdefghij' returns 400", False, f"Exception: {str(e)}")
    
    # Test empty phone (should be allowed)
    valid_inquiry_no_phone = {
        "name": "Priya Sharma",
        "email": "priya.sharma@example.com",
        "country_code": "+977",
        "phone": "",
        "message": "Inquiry without phone"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/inquiries", json=valid_inquiry_no_phone)
        print(f"Empty phone - Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code in [200, 201]:
            log_test("POST /api/inquiries with empty phone is allowed", True)
        else:
            log_test("POST /api/inquiries with empty phone is allowed", False, 
                    f"Expected 200/201, got {response.status_code}")
    except Exception as e:
        log_test("POST /api/inquiries with empty phone is allowed", False, f"Exception: {str(e)}")
    
    return inquiry_id


def test_inquiry_auth_protection(inquiry_id: Optional[str]):
    """Test 6: GET /api/inquiries auth protection"""
    print("=" * 80)
    print("TEST 6: GET /api/inquiries - Auth protection")
    print("=" * 80)
    
    # Test without token
    try:
        response = requests.get(f"{BASE_URL}/inquiries")
        print(f"Without token - Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code in [401, 403]:
            log_test("GET /api/inquiries without token returns 401/403", True)
        else:
            log_test("GET /api/inquiries without token returns 401/403", False, 
                    f"Expected 401/403, got {response.status_code}")
    except Exception as e:
        log_test("GET /api/inquiries without token returns 401/403", False, f"Exception: {str(e)}")
    
    # Test with valid token
    if admin_token:
        try:
            headers = {"Authorization": f"Bearer {admin_token}"}
            response = requests.get(f"{BASE_URL}/inquiries", headers=headers)
            print(f"With valid token - Status: {response.status_code}")
            inquiries = response.json()
            print(f"Number of inquiries: {len(inquiries)}")
            
            if response.status_code == 200:
                # Check if our created inquiry is in the list
                if inquiry_id:
                    found = any(inq.get("id") == inquiry_id for inq in inquiries)
                    if found:
                        log_test("GET /api/inquiries with token returns list including created inquiry", True, 
                                f"Found {len(inquiries)} inquiries including our test inquiry")
                    else:
                        log_test("GET /api/inquiries with token returns list including created inquiry", False, 
                                f"Created inquiry {inquiry_id} not found in list")
                else:
                    log_test("GET /api/inquiries with token returns list", True, 
                            f"Found {len(inquiries)} inquiries")
            else:
                log_test("GET /api/inquiries with token returns list", False, 
                        f"Expected 200, got {response.status_code}")
        except Exception as e:
            log_test("GET /api/inquiries with token returns list", False, f"Exception: {str(e)}")
    else:
        log_test("GET /api/inquiries with token returns list", False, "No admin token available")


def test_services_crud():
    """Test 7: Services CRUD operations with auth"""
    print("=" * 80)
    print("TEST 7: Services CRUD - Admin operations")
    print("=" * 80)
    
    if not admin_token:
        log_test("Services CRUD operations", False, "No admin token available")
        return
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Test POST without token (should fail)
    new_service = {
        "title": "Financial Planning",
        "desc": "Comprehensive financial planning services",
        "image": "data:image/png;base64,iVBORw0KGgo=",
        "order": 99
    }
    
    try:
        response = requests.post(f"{BASE_URL}/services", json=new_service)
        print(f"POST /api/services without token - Status: {response.status_code}")
        
        if response.status_code in [401, 403]:
            log_test("POST /api/services without token is rejected", True)
        else:
            log_test("POST /api/services without token is rejected", False, 
                    f"Expected 401/403, got {response.status_code}")
    except Exception as e:
        log_test("POST /api/services without token is rejected", False, f"Exception: {str(e)}")
    
    # Test POST with token (should succeed)
    service_id = None
    try:
        response = requests.post(f"{BASE_URL}/services", json=new_service, headers=headers)
        print(f"POST /api/services with token - Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code in [200, 201]:
            service_data = response.json()
            if "id" in service_data:
                service_id = service_data["id"]
                log_test("POST /api/services with token creates service", True, 
                        f"Service created with ID: {service_id}")
            else:
                log_test("POST /api/services with token creates service", False, 
                        "Response missing 'id' field")
        else:
            log_test("POST /api/services with token creates service", False, 
                    f"Expected 200/201, got {response.status_code}")
    except Exception as e:
        log_test("POST /api/services with token creates service", False, f"Exception: {str(e)}")
    
    # Test PUT (update)
    if service_id:
        updated_service = {
            "title": "Financial Planning & Advisory",
            "desc": "Updated description",
            "order": 99
        }
        
        try:
            response = requests.put(f"{BASE_URL}/services/{service_id}", 
                                   json=updated_service, headers=headers)
            print(f"PUT /api/services/{service_id} - Status: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                updated_data = response.json()
                if updated_data.get("title") == "Financial Planning & Advisory":
                    log_test("PUT /api/services/{id} updates service", True, 
                            f"Service title updated successfully")
                else:
                    log_test("PUT /api/services/{id} updates service", False, 
                            f"Title not updated correctly")
            else:
                log_test("PUT /api/services/{id} updates service", False, 
                        f"Expected 200, got {response.status_code}")
        except Exception as e:
            log_test("PUT /api/services/{id} updates service", False, f"Exception: {str(e)}")
        
        # Test DELETE
        try:
            response = requests.delete(f"{BASE_URL}/services/{service_id}", headers=headers)
            print(f"DELETE /api/services/{service_id} - Status: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                log_test("DELETE /api/services/{id} deletes service", True)
            else:
                log_test("DELETE /api/services/{id} deletes service", False, 
                        f"Expected 200, got {response.status_code}")
        except Exception as e:
            log_test("DELETE /api/services/{id} deletes service", False, f"Exception: {str(e)}")


def test_expertise_crud():
    """Test 8: Expertise CRUD operations with auth"""
    print("=" * 80)
    print("TEST 8: Expertise CRUD - Admin operations")
    print("=" * 80)
    
    if not admin_token:
        log_test("Expertise CRUD operations", False, "No admin token available")
        return
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Test POST without token (should fail)
    new_expertise = {
        "title": "Forensic Accounting",
        "image": "data:image/png;base64,iVBORw0KGgo="
    }
    
    try:
        response = requests.post(f"{BASE_URL}/expertise", json=new_expertise)
        print(f"POST /api/expertise without token - Status: {response.status_code}")
        
        if response.status_code in [401, 403]:
            log_test("POST /api/expertise without token is rejected", True)
        else:
            log_test("POST /api/expertise without token is rejected", False, 
                    f"Expected 401/403, got {response.status_code}")
    except Exception as e:
        log_test("POST /api/expertise without token is rejected", False, f"Exception: {str(e)}")
    
    # Test POST with token (should succeed)
    expertise_id = None
    try:
        response = requests.post(f"{BASE_URL}/expertise", json=new_expertise, headers=headers)
        print(f"POST /api/expertise with token - Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code in [200, 201]:
            expertise_data = response.json()
            if "id" in expertise_data:
                expertise_id = expertise_data["id"]
                log_test("POST /api/expertise with token creates expertise", True, 
                        f"Expertise created with ID: {expertise_id}")
            else:
                log_test("POST /api/expertise with token creates expertise", False, 
                        "Response missing 'id' field")
        else:
            log_test("POST /api/expertise with token creates expertise", False, 
                    f"Expected 200/201, got {response.status_code}")
    except Exception as e:
        log_test("POST /api/expertise with token creates expertise", False, f"Exception: {str(e)}")
    
    # Test PUT (update)
    if expertise_id:
        updated_expertise = {
            "title": "Forensic Accounting & Investigation"
        }
        
        try:
            response = requests.put(f"{BASE_URL}/expertise/{expertise_id}", 
                                   json=updated_expertise, headers=headers)
            print(f"PUT /api/expertise/{expertise_id} - Status: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                updated_data = response.json()
                if updated_data.get("title") == "Forensic Accounting & Investigation":
                    log_test("PUT /api/expertise/{id} updates expertise", True, 
                            f"Expertise title updated successfully")
                else:
                    log_test("PUT /api/expertise/{id} updates expertise", False, 
                            f"Title not updated correctly")
            else:
                log_test("PUT /api/expertise/{id} updates expertise", False, 
                        f"Expected 200, got {response.status_code}")
        except Exception as e:
            log_test("PUT /api/expertise/{id} updates expertise", False, f"Exception: {str(e)}")
        
        # Test DELETE
        try:
            response = requests.delete(f"{BASE_URL}/expertise/{expertise_id}", headers=headers)
            print(f"DELETE /api/expertise/{expertise_id} - Status: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                log_test("DELETE /api/expertise/{id} deletes expertise", True)
            else:
                log_test("DELETE /api/expertise/{id} deletes expertise", False, 
                        f"Expected 200, got {response.status_code}")
        except Exception as e:
            log_test("DELETE /api/expertise/{id} deletes expertise", False, f"Exception: {str(e)}")


def test_inquiry_deletion(inquiry_id: Optional[str]):
    """Test 9: DELETE /api/inquiries/{id} with admin token"""
    print("=" * 80)
    print("TEST 9: DELETE /api/inquiries/{id} - Admin deletion")
    print("=" * 80)
    
    if not admin_token:
        log_test("DELETE /api/inquiries/{id} with admin token", False, "No admin token available")
        return
    
    if not inquiry_id:
        log_test("DELETE /api/inquiries/{id} with admin token", False, "No inquiry ID available")
        return
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    try:
        response = requests.delete(f"{BASE_URL}/inquiries/{inquiry_id}", headers=headers)
        print(f"DELETE /api/inquiries/{inquiry_id} - Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            log_test("DELETE /api/inquiries/{id} with admin token works", True)
        else:
            log_test("DELETE /api/inquiries/{id} with admin token works", False, 
                    f"Expected 200, got {response.status_code}")
    except Exception as e:
        log_test("DELETE /api/inquiries/{id} with admin token works", False, f"Exception: {str(e)}")


def print_summary():
    """Print test summary"""
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print(f"Total tests: {test_results['total']}")
    print(f"Passed: {len(test_results['passed'])}")
    print(f"Failed: {len(test_results['failed'])}")
    print(f"Success rate: {len(test_results['passed']) / test_results['total'] * 100:.1f}%")
    
    if test_results['failed']:
        print("\n❌ FAILED TESTS:")
        for test in test_results['failed']:
            print(f"  - {test}")
    
    if test_results['passed']:
        print("\n✅ PASSED TESTS:")
        for test in test_results['passed']:
            print(f"  - {test}")
    
    print("=" * 80)


def main():
    """Run all tests"""
    print("\n" + "=" * 80)
    print("KEDIA AND ASSOCIATES - BACKEND API TEST SUITE")
    print("=" * 80)
    print(f"Base URL: {BASE_URL}")
    print(f"Admin credentials: {ADMIN_USERNAME} / {ADMIN_PASSWORD}")
    print("=" * 80 + "\n")
    
    # Run tests in sequence
    test_root()
    test_admin_login()
    test_services_list()
    test_expertise_list()
    inquiry_id = test_inquiry_creation()
    test_inquiry_auth_protection(inquiry_id)
    test_services_crud()
    test_expertise_crud()
    test_inquiry_deletion(inquiry_id)
    
    # Print summary
    print_summary()
    
    # Return exit code
    return 0 if len(test_results['failed']) == 0 else 1


if __name__ == "__main__":
    exit(main())
