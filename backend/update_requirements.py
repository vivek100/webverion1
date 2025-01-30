import subprocess
import re

# Function to get the latest version of a library
def get_latest_version(library):
    try:
        # Run the "pip index versions" command
        result = subprocess.run(
            ["pip", "index", "versions", library],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        # Check if the command executed successfully
        if result.returncode == 0:
            # Extract the versions from the output
            versions = re.findall(r"Available versions: (.+)", result.stdout)
            if versions:
                # Return the latest version (first in the list)
                return versions[0].split(",")[0].strip()
        else:
            print(f"Error fetching versions for {library}: {result.stderr.strip()}")
    except Exception as e:
        print(f"An error occurred while fetching versions for {library}: {e}")
    return None

# Function to process requirements.txt and generate newrequirements.txt
def update_requirements(input_file, output_file):
    try:
        with open(input_file, "r") as infile, open(output_file, "w") as outfile:
            for line in infile:
                line = line.strip()
                if line and not line.startswith("#"):
                    # Extract library name (and ignore any specific version)
                    library = re.split(r"[=<>]", line)[0]
                    print(f"Fetching latest version for: {library}")

                    # Get the latest version
                    latest_version = get_latest_version(library)

                    if latest_version:
                        # Write the updated library with the latest version
                        outfile.write(f"{library}=={latest_version}\n")
                    else:
                        # If unable to fetch, write the original line
                        print(f"Could not fetch latest version for {library}, keeping original.")
                        outfile.write(f"{line}\n")
                else:
                    # Write comments or empty lines as is
                    outfile.write(f"{line}\n")
        print(f"Updated requirements written to {output_file}")
    except FileNotFoundError:
        print(f"Error: {input_file} not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Specify input and output file paths
input_requirements = "requirements.txt"
output_requirements = "newrequirements.txt"

# Run the update process
update_requirements(input_requirements, output_requirements)
